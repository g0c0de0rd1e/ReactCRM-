import React, { useState } from 'react';
import {
  CheckOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Image, Input, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import getImage from 'helpers/getImage';
import numberToPrice from 'helpers/numberToPrice';
import ProductModal from './product-modal';
import {
  addCoupon,
  addToCart,
  reduceCart,
  removeAddonFromCartItem,
  removeFromCart,
} from 'redux/slices/cart';

const CardData = ({
  handleCheckCoupon,
  loadingCoupon,
  handleClick,
  loading,
  data,
}) => {
  const { t } = useTranslation();
  const [extrasModal, setExtrasModal] = useState(null);
  const dispatch = useDispatch();
  const { total, coupons, currency, cartShops } = useSelector(
    (state) => state.cart,
    shallowEqual,
  );

  const increment = (item) => {
    if (item.quantity === item?.stockID?.quantity) {
      return;
    }
    if (item.quantity === item.max_qty) {
      return;
    }
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const decrement = (item) => {
    if (item.quantity === 1) {
      return;
    }
    if (item.quantity <= item.min_qty) {
      return;
    }
    dispatch(reduceCart({ ...item, quantity: 1 }));
  };

  const deleteCard = (e) => {
    if (e?.stockID?.addon) {
      dispatch(removeAddonFromCartItem(e));
    } else {
      dispatch(removeFromCart(e));
    }
  };

  return (
    <div className='card-save'>
      {cartShops?.map((shop, idx) => (
        <div key={shop.uuid + '_' + idx}>
          <div className='all-price'>
            <span className='title'>
              {shop?.translation?.title} {t('shop')}
            </span>
            <span className='counter'>
              {shop?.products?.length}{' '}
              {shop?.products?.length > 1 ? t('products') : t('product')}
            </span>
          </div>
          {shop?.products?.map((item, index) =>
            item?.bonus !== true ? (
              <div
                className='custom-cart-container'
                key={item?.id + '_' + index}
              >
                <Row className='product-row'>
                  <Image
                    width={70}
                    height='auto'
                    src={getImage(item?.img)}
                    preview
                    placeholder
                    className='rounded'
                  />
                  <Col span={18} className='product-col'>
                    <div>
                      <span className='product-name'>
                        {item?.translation?.title}
                      </span>
                      <br />
                      <Space wrap className='mt-2'>
                        {item?.stock?.map((el, idy) => {
                          return (
                            <span
                              key={idy + '-' + el?.value}
                              className='extras-text rounded pr-2 pl-2'
                            >
                              {el.value}
                            </span>
                          );
                        })}
                      </Space>
                      <br />
                      <Space wrap className='mt-2'>
                        {item?.addons?.map((addon, idk) => {
                          return (
                            <span
                              key={idk + '-' + addon?.quantity}
                              className='extras-text rounded pr-2 pl-2'
                            >
                              {addon?.countable?.translation?.title} x{' '}
                              {addon?.quantity}
                            </span>
                          );
                        })}
                      </Space>
                      <div className='product-counter'>
                        <Space>
                          <div className={item?.discount ? 'strike' : ''}>
                            {numberToPrice(item?.price, currency?.symbol)}
                          </div>
                          {item?.discount ? (
                            <div className='ml-2 font-weight-bold'>
                              {numberToPrice(
                                item?.total_price,
                                currency?.symbol,
                              )}
                            </div>
                          ) : (
                            ''
                          )}
                        </Space>

                        <div className='count'>
                          <Button
                            className='button-counter'
                            shape='circle'
                            icon={<MinusOutlined size={14} />}
                            onClick={() => decrement(item)}
                          />
                          <span>{item?.countable_quantity}</span>
                          <Button
                            className='button-counter'
                            shape='circle'
                            icon={<PlusOutlined size={14} />}
                            onClick={() => increment(item)}
                          />
                          <Button
                            className='button-counter'
                            shape='circle'
                            onClick={() => deleteCard(item)}
                            icon={<DeleteOutlined size={14} />}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <>
                <h4 className='mt-2'> {t('Bonus.product')} </h4>
                <div
                  className='custom-cart-container'
                  key={item?.id + '_' + index}
                >
                  <Row className='product-row'>
                    <Image
                      width={70}
                      height='auto'
                      src={getImage(item?.img)}
                      preview
                      placeholder
                      className='rounded'
                    />
                    <Col span={18} className='product-col'>
                      <div>
                        <span className='product-name'>
                          {item?.translation?.title}
                        </span>
                        <br />
                        <Space wrap className='mt-2'>
                          {item?.stock?.map((el, idj) => {
                            return (
                              <span
                                key={idj + '_' + el?.value}
                                className='extras-text rounded pr-2 pl-2'
                              >
                                {el?.value}
                              </span>
                            );
                          })}
                        </Space>
                        <br />
                        <Space wrap className='mt-2'>
                          {item.addons?.map((addon, idp) => {
                            return (
                              <span
                                key={idp + '_' + addon?.quantity}
                                className='extras-text rounded pr-2 pl-2'
                              >
                                {addon?.countable?.translation?.title} x{' '}
                                {addon?.quantity}
                              </span>
                            );
                          })}
                        </Space>
                        <div className='product-counter'>
                          <span>
                            {numberToPrice(
                              item?.total_price || item?.price,
                              currency?.symbol,
                            )}
                          </span>

                          <div className='count'>
                            <Button
                              className='button-counter'
                              shape='circle'
                              icon={<MinusOutlined size={14} />}
                              onClick={() => decrement(item)}
                              disabled
                            />
                            <span>{item?.quantity}</span>
                            <Button
                              className='button-counter'
                              shape='circle'
                              icon={<PlusOutlined size={14} />}
                              onClick={() => increment(item)}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </>
            ),
          )}

          <div className='d-flex my-3'>
            <Input
              placeholder={t('coupon')}
              className='w-100 mr-2'
              addonAfter={
                coupons.find((el) => el?.shop_id === shop?.id)?.verified ? (
                  <CheckOutlined style={{ color: '#18a695' }} />
                ) : null
              }
              defaultValue={
                coupons.find((el) => el?.shop_id === shop?.id)?.coupon
              }
              onBlur={(event) =>
                dispatch(
                  addCoupon({
                    coupon: event?.target?.value,
                    user_id: data?.user?.value,
                    shop_id: shop?.id,
                    verified: false,
                  }),
                )
              }
            />
            <Button
              onClick={() => handleCheckCoupon(shop?.id)}
              loading={loadingCoupon === shop?.id}
            >
              {t('check.coupon')}
            </Button>
          </div>
        </div>
      ))}

      <Row className='all-price-row'>
        <Col span={24} className='col'>
          <div className='all-price-container'>
            <span>{t('sub.total')}</span>
            <span>{numberToPrice(total?.product_total, currency?.symbol)}</span>
          </div>
          <div className='all-price-container'>
            <span>{t('shop.tax')}</span>
            <span>{numberToPrice(total?.shop_tax, currency?.symbol)}</span>
          </div>
          <div className='all-price-container'>
            <span>{t('delivery.fee')}</span>
            <span>{numberToPrice(total?.delivery_fee, currency?.symbol)}</span>
          </div>
          <div className='all-price-container'>
            <span>{t('discount')}</span>
            <span>{numberToPrice(total?.discount, currency?.symbol)}</span>
          </div>
        </Col>
      </Row>

      <Row className='submit-row'>
        <Col span={14} className='col'>
          <span>{t('total.amount')}</span>
          <span>{numberToPrice(total?.order_total, currency?.symbol)}</span>
        </Col>
        <Col className='col2'>
          <Button
            type='primary'
            onClick={() => handleClick()}
            disabled={!cartShops?.length}
            loading={loading}
          >
            {t('place.order')}
          </Button>
        </Col>
      </Row>

      {extrasModal && (
        <ProductModal
          extrasModal={extrasModal}
          setExtrasModal={setExtrasModal}
        />
      )}
    </div>
  );
};

export default CardData;
