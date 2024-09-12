import React, { useState } from 'react';
import { Card, Form, Spin } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  setCartShops,
  clearCartShops,
  setCartTotal,
  verifyCoupon,
  removeBag,
  setCartData,
  setCartOrder,
} from '../../../redux/slices/cart';
import useDidUpdate from '../../../helpers/useDidUpdate';
import orderService from '../../../services/order';
import invokableService from '../../../services/rest/invokable';
import { useTranslation } from 'react-i18next';
import {
  getCartData,
  getCartItems,
} from '../../../redux/selectors/cartSelector';
import PreviewInfo from '../../order/preview-info';
import { toast } from 'react-toastify';
import { fetchPosProducts } from '../../../redux/slices/pos-system';
import useDebounce from '../../../helpers/useDebounce';
import transactionService from '../../../services/transaction';
import moment from 'moment';
import QueryString from 'qs';
import CardData from './cardData';
import { DEMO_ADMIN } from '../../../configs/app-global';

export default function OrderCart() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { cartItems, currentBag, total, coupons, currency } = useSelector(
    (state) => state.cart,
    shallowEqual,
  );
  const filteredCartItems = useSelector((state) => getCartItems(state.cart));
  const data = useSelector((state) => getCartData(state.cart));
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(null);
  const debouncedCartItems = useDebounce(cartItems, 300);

  const clearAll = () => {
    dispatch(clearCart());
    if (currentBag !== 0) {
      dispatch(removeBag(currentBag));
    }
  };

  function formatProducts(list) {
    const product = list.map((item) => ({
      quantity: item.quantity,
      stock_id: item.stockID ? item.stockID?.id : item.stock?.id,
    }));

    const addons = list.flatMap((item) =>
      item.addons.map((addon) => ({
        quantity: addon.quantity,
        stock_id: addon.stockID,
        parent_id: item.stockID ? item.stockID?.id : item.stock?.id,
      })),
    );

    const combine = product.concat(addons);

    const result = {
      products: combine,
      currency_id: currency?.id,
      coupon: data?.coupon?.name,
      shop_id: data?.shop?.id,
      type: data?.deliveries?.label?.toLowerCase(),
      address: {
        latitude: data?.address?.lat,
        longitude: data?.address?.lng,
      },
    };
    return QueryString.stringify(result, { addQueryPrefix: true });
  }

  function productCalculate() {
    const products = formatProducts(filteredCartItems);
    setLoading(true);
    orderService
      .calculate(products)
      .then(({ data }) => {
        const product = data?.data;

        const items = product?.stocks.map((item) => ({
          ...filteredCartItems.find((el) => el?.id === item?.id),
          ...item,
          ...item?.stock?.countable,
          quantity:
            item?.quantity -
            item?.addons.reduce((acc, item) => (acc += item?.quantity), 0),
          stock: item?.stock?.stock_extras,
          stocks: item?.stock?.stock_extras,
          stockID: item?.stock,
        }));

        const shopList = [{ ...data?.shop, products: items }];

        const orderProductsTotal = {
          product_total: product.stocks?.reduce(
            (acc, curr) => acc + (curr?.total_price || curr?.price),
            0,
          ),
          product_tax: product?.total_tax,
          shop_tax: product?.total_shop_tax,
          order_total: product?.total_price,
          delivery_fee: product?.delivery_fee,
          discount: product?.total_discount,
        };

        batch(() => {
          dispatch(setCartShops(shopList));
          dispatch(setCartTotal(orderProductsTotal));
        });
      })
      .finally(() => setLoading(false));
  }

  const handleSave = (id) => setOrderId(id);

  const handleCloseInvoice = () => {
    clearAll();
    toast.success(t('successfully.closed'));
    dispatch(
      fetchPosProducts({
        perPage: 12,
        currency_id: currency?.id,
        shop_id: data?.shop?.id || DEMO_ADMIN,
        status: 'published',
      }),
    );
    setOrderId(null);
  };

  useDidUpdate(() => {
    dispatch(
      fetchPosProducts({
        perPage: 12,
        currency_id: currency?.id,
        shop_id: data?.shop?.id || DEMO_ADMIN,
        status: 'published',
      }),
    );
    if (filteredCartItems.length) {
      productCalculate();
    }
  }, [currency]);

  useDidUpdate(() => {
    if (filteredCartItems.length) {
      productCalculate();
    } else {
      dispatch(clearCartShops());
    }
  }, [debouncedCartItems, currentBag, data?.address, currency]);

  function handleCheckCoupon(shopId) {
    //checking coupon before sending to server
    let coupon = coupons.find((item) => item.shop_id === shopId);
    if (!coupon) {
      return;
    }

    setLoadingCoupon(shopId);
    invokableService
      .checkCoupon(coupon)
      .then((res) => {
        const coupon = res.data.id;
        dispatch(setCartData({ coupon, bag_id: currentBag }));
        dispatch(
          verifyCoupon({
            shop_id: shopId,
            price: res.data.price,
            verified: true,
          }),
        );
      })
      .catch(() =>
        dispatch(
          verifyCoupon({
            shop_id: shopId,
            price: 0,
            verified: false,
          }),
        ),
      )
      .finally(() => setLoadingCoupon(null));
  }

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => handleSave(res.data.id))
      .finally(() => setLoading(false));
  }

  const handleClick = () => {
    if (!data.paymentType) {
      toast.warning(t('please.select.payment_type'));
      return;
    }
    if (!data.address) {
      toast.warning(t('please.select.address'));
      return;
    }
    if (!data.delivery_time) {
      toast.warning(t('please.select.delivery_time'));
      return;
    }
    if (!data.delivery_date) {
      toast.warning(t('please.select.deliveryDate'));
      return;
    }

    setLoading(true);
    const products = cartItems?.map((cart) => ({
      stock_id: cart.stockID?.id,
      quantity: cart.quantity,
      bonus: cart.bonus,
    }));
    const addons = cartItems?.flatMap((product) =>
      product.addons?.map((addon) => ({
        stock_id: addon.stockID,
        quantity: addon.quantity,
        parent_id: product.stockID.id,
      })),
    );
    const body = {
      user_id: data.user?.value,
      currency_id: currency?.id,
      rate: currency.rate,
      shop_id: data.shop.id,
      delivery_id: data.deliveries.label,
      delivery_fee: data.delivery_fee,
      coupon: coupons[0]?.coupon,
      tax: total.order_tax,
      payment_type: data.paymentType?.label,
      delivery_date: data.delivery_date,
      delivery_address_id: data.address?.address,
      address: {
        address: data.address?.address,
        office: null,
        house: null,
        floor: null,
      },
      location: {
        latitude: data.address?.lat,
        longitude: data.address?.lng,
      },
      delivery_time: moment(data.delivery_time, 'HH:mm').format('HH:mm'),
      delivery_type: data.deliveries.label.toLowerCase(),
      delivery_type_id: data.deliveries.value,
      products: products.concat(...addons),
    };

    const payment = {
      payment_sys_id: data.paymentType.value,
    };

    orderService
      .create(body)
      .then((response) => {
        dispatch(setCartOrder(response.data));
        createTransaction(response.data.id, payment);
        form.resetFields();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <Card>
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <CardData
        handleCheckCoupon={handleCheckCoupon}
        handleClick={handleClick}
        loadingCoupon={loadingCoupon}
        loading={loading}
        data={data}
      />
      {orderId ? (
        <PreviewInfo orderId={orderId} handleClose={handleCloseInvoice} />
      ) : (
        ''
      )}
    </Card>
  );
}
