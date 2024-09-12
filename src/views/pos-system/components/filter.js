import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { DebounceSelect } from '../../../components/search';
import shopService from '../../../services/shop';
import brandService from '../../../services/brand';
import categoryService from '../../../services/category';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchPosProducts } from '../../../redux/slices/pos-system';
import SearchInput from '../../../components/search-input';
import { useTranslation } from 'react-i18next';
import { clearCart, setCartData } from '../../../redux/slices/cart';
import { fetchRestPayments } from '../../../redux/slices/payment';
import { disableRefetch } from '../../../redux/slices/menu';
import { getCartData } from '../../../redux/selectors/cartSelector';
import restPaymentService from '../../../services/rest/payment';
import { DEMO_ADMIN } from '../../../configs/app-global';

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { currentBag } = useSelector((state) => state.cart, shallowEqual);
  const cartData = useSelector((state) => getCartData(state.cart));
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState(null);
  const [shop, setShop] = useState({
    label: myShop?.translation?.title,
    value: myShop?.id,
    key: myShop?.id,
  });

  async function fetchUserShop(search) {
    const params = { search, status: 'approved' };
    return shopService.search(params).then((res) =>
      res?.data?.map((item) => ({
        label:
          item?.translation !== null ? item?.translation?.title : 'no name',
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  async function fetchUserBrand(username) {
    return brandService.search(username).then((res) =>
      res?.data?.map((item) => ({
        label: item?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  async function fetchUserCategory(search) {
    const params = { search, type: 'main' };
    return categoryService.search(params).then((res) =>
      res?.data?.map((item) => ({
        label:
          item?.translation !== null ? item?.translation?.title : 'no name',
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  async function fetchSellerPayments() {
    const params = cartData?.shop?.id || DEMO_ADMIN;
    return restPaymentService.getById(params).then((res) => {
      dispatch(
        setCartData({
          bag_id: currentBag,
          payment_type: res?.data?.map((item) => item?.payment),
        }),
      );
    });
  }

  function getShops() {
    shopService.getById(shop?.value || DEMO_ADMIN).then((res) =>
      dispatch(
        setCartData({
          bag_id: currentBag,
          currency_shop: res?.data,
          shop: res?.data,
        }),
      ),
    );
  }

  useDidUpdate(() => {
    const params = {
      search,
      brand_id: brand?.value,
      category_id: category?.value,
      shop_id: shop?.value || DEMO_ADMIN,
      status: 'published',
      active: 1,
    };
    dispatch(fetchPosProducts(params));
    return fetchSellerPayments();
  }, [brand, category, search, shop]);

  const selectShop = () => dispatch(clearCart());

  useEffect(() => {
    const body = {
      shop_id: shop?.value || DEMO_ADMIN,
    };
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchRestPayments(body));
        dispatch(setCartData({ bag_id: currentBag, shop: cartData?.shop }));
        dispatch(disableRefetch(activeMenu));
      });
    }
    getShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch, shop]);

  return (
    <Card>
      <Row gutter={12}>
        <Col span={6}>
          <SearchInput
            className='w-100'
            placeholder={t('search')}
            handleChange={setSearch}
          />
        </Col>
        <Col span={6}>
          <DebounceSelect
            className='w-100'
            debounceTimeout={500}
            placeholder={t('select.shop')}
            fetchOptions={fetchUserShop}
            allowClear={true}
            onChange={(value) => {
              setShop(value);
              selectShop();
            }}
            value={shop}
          />
        </Col>
        <Col span={6}>
          <DebounceSelect
            className='w-100'
            placeholder={t('select.category')}
            fetchOptions={fetchUserCategory}
            onChange={(value) => setCategory(value)}
            value={category}
          />
        </Col>
        <Col span={6}>
          <DebounceSelect
            className='w-100'
            placeholder={t('select.brand')}
            fetchOptions={fetchUserBrand}
            onChange={(value) => setBrand(value)}
            value={brand}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default Filter;
