import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import extraService from 'services/seller/extras';
import { DeleteOutlined } from '@ant-design/icons';
import productService from 'services/seller/product';
import { setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DebounceSelect } from 'components/search';
import Loading from 'components/loading';
import cartesian from 'helpers/cartesian';
import { AsyncSelect } from 'components/async-select';

const ProductStock = ({ prev, next }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(null);
  const [loading, setLoading] = useState(null);
  const { defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const onFinish = (values) => {
    setLoadingBtn(true);
    const { stocks } = values;
    let extras;
    const isProductWithExtras = !!activeMenu.data?.extras?.length;
    if (isProductWithExtras) {
      extras = stocks.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        ids: activeMenu.data?.extras.map(
          (_, idx) => item[`extras[${idx}]`].value
        ),
        addons: item.addons ? item.addons?.map((i) => i.value) : [],
      }));
    } else {
      extras = [
        {
          price: stocks[0].price,
          quantity: stocks[0].quantity,
          addons: stocks[0].addons ? stocks[0].addons.map((i) => i.value) : [],
        },
      ];
    }

    productService
      .stocks(uuid, { extras })
      .then(() => next())
      .finally(() => setLoadingBtn(false));
  };

  console.log(activeMenu?.data.extras);

  function fetchProduct(uuid) {
    setLoading(true);
    productService
      .getById(uuid)
      .then((res) => {
        const additionalStocks = cartesian(
          activeMenu?.data.extras?.map((extra) => extra.values || [])
        );
        console.log(additionalStocks);

        const parsedAdditionalStocks = additionalStocks.map((item) => {
          const selectedStock = res.data?.stocks?.find((stock) => {
            return stock.extras.every((extra) => {
              return item.some((addStock) => addStock.value === extra.id);
            });
          });
          return {
            price: selectedStock?.price || 0,
            quantity: selectedStock?.quantity || 0,
            sku: selectedStock?.sku,
            stock_id: selectedStock?.id,
            tax: activeMenu?.data.tax || 0,
            addons:
              selectedStock?.addons?.map((item) => ({
                label: item?.product?.translation?.title || item?.label,
                value: item?.product?.id || item?.value,
              })) || [],
            ...Object.assign(
              {},
              ...item.map((extra, idx) => ({
                [`extras[${idx}]`]: {
                  label: extra.label,
                  value: extra.value,
                  group: activeMenu.data.extras[idx].label,
                },
              }))
            ),
          };
        });
        let defaultStock = [];
        if (additionalStocks.length === 0 && res?.data?.stocks?.length !== 0) {
          const stockWithoutExtras = res?.data?.stocks?.at(0);
          defaultStock = [
            {
              price: stockWithoutExtras?.price || 0,
              quantity: stockWithoutExtras?.quantity || 0,
              sku: stockWithoutExtras?.sku,
              tax: activeMenu.data?.tax || 0,
              addons: stockWithoutExtras
                ? stockWithoutExtras.addons?.map((item) => ({
                    label: item?.product?.translation?.title || item?.label,
                    value: item?.product?.id || item?.value,
                  }))
                : [],
            },
          ];
        }
        if (additionalStocks.length === 0 && res?.data?.stocks?.length === 0) {
          defaultStock = [
            {
              price: undefined,
              quantity: 0,
              sku: activeMenu?.data?.sku,
              tax: activeMenu.data?.tax || 0,
              addons: [],
            },
          ];
        }
        const stocks = defaultStock.concat(parsedAdditionalStocks);
        console.log(stocks);
        form.setFieldsValue({
          stocks,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchExtra(id) {
    return extraService.getGroupById(id).then((res) =>
      res.data.extra_values.map((item) => ({
        label: item.value,
        value: item.id,
      }))
    );
  }

  function addToMenu() {
    const extras = form.getFieldsValue(true);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, stocks: extras.stocks },
      })
    );
  }
  const fetchAddons = (search) => {
    const params = {
      search,
      addon: 1,
      shop_id: activeMenu.data.shop?.value,
      status: 'published',
    };
    return productService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
      }))
    );
  };

  useEffect(() => {
    fetchProduct(uuid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title={activeMenu.data[`title[${defaultLang}]`] ? `${activeMenu.data[`title[${defaultLang}]`]}` : ""}>
      {loading ? (
        <Loading />
      ) : (
        <Form layout='vertical' form={form} onFinish={onFinish}>
          <Form.List name='stocks'>
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <Row
                        key={field.key}
                        gutter={12}
                        align='middle'
                        style={{ flexWrap: 'nowrap', overflowX: 'auto' }}
                        hidden={!activeMenu.data?.extras?.length && field.key}
                      >
                        {activeMenu.data?.extras?.map((item, idx) => (
                          <Col key={'extra' + item.value}>
                            <Form.Item
                              label={item?.label}
                              name={[index, `extras[${idx}]`]}
                              rules={[
                                { required: true, message: t('required') },
                              ]}
                            >
                              <AsyncSelect
                                fetchOptions={() => fetchExtra(item.value)}
                                className='w-100'
                                disabled
                                style={{ minWidth: 200 }}
                              />
                            </Form.Item>
                          </Col>
                        ))}
                        <Col>
                          <Form.Item
                            label={t('addons')}
                            name={[index, 'addons']}
                            rules={[
                              { required: false, message: t('required') },
                            ]}
                          >
                            <DebounceSelect
                              mode='multiple'
                              style={{ minWidth: '300px' }}
                              fetchOptions={fetchAddons}
                              allowClear={true}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item label={t('sku')} name={[index, 'sku']}>
                            <Input
                              className='w-100'
                              style={{ minWidth: 200 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item
                            label={t('quantity')}
                            name={[index, 'quantity']}
                            rules={[{ required: true, message: t('required') }]}
                          >
                            <InputNumber
                              min={0}
                              className='w-100'
                              style={{ minWidth: 200 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item
                            label={`${t('price')} (${defaultCurrency?.symbol})`}
                            name={[index, 'price']}
                            rules={[{ required: true, message: t('requried') }]}
                          >
                            <InputNumber
                              min={0}
                              className='w-100'
                              style={{ minWidth: 200 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item label={t('tax')} name={[index, 'tax']}>
                            <InputNumber
                              className='w-100'
                              disabled
                              style={{ minWidth: 200 }}
                              addonAfter='%'
                            />
                          </Form.Item>
                          <Form.Item
                            hidden
                            label={t('id')}
                            name={[index, 'stock_id']}
                          >
                            <InputNumber
                              className='w-100'
                              disabled
                              style={{ minWidth: 200 }}
                              addonAfter='%'
                            />
                          </Form.Item>
                        </Col>{' '}
                        <Col>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, nextValues) =>
                              prevValues.stocks[field.name].price !==
                              nextValues.stocks[field.name].price
                            }
                          >
                            {({ getFieldValue }) => {
                              const tax =
                                getFieldValue(['stocks', field.name, 'tax']) ||
                                0;

                              const price = getFieldValue([
                                'stocks',
                                field.name,
                                'price',
                              ]);
                              const totalPrice =
                                tax === 0 ? price : (price * tax) / 100 + price;
                              return (
                                <Form.Item label={`${t('total.price')} (${defaultCurrency?.symbol})`}>
                                  <InputNumber
                                    min={1}
                                    disabled
                                    value={totalPrice}
                                    className='w-100'
                                    style={{ minWidth: 200 }}
                                  />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Col>
                        <Col>
                          {field.key ? (
                            <Button
                              type='primary'
                              className='mt-2'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          ) : (
                            ''
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
          <Space className='mt-4'>
            <Button onClick={prev}>{t('prev')}</Button>
            <Button type='primary' htmlType='submit' loading={!!loadingBtn}>
              {t('next')}
            </Button>
          </Space>
        </Form>
      )}
    </Card>
  );
};

export default ProductStock;
