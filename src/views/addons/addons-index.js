import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import productService from '../../services/product';
import { replaceMenu, setMenuData } from '../../redux/slices/menu';
import unitService from '../../services/unit';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/lib/input/TextArea';

const ProductsIndex = ({ next, action_type = '' }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      min_qty: 1,
      max_qty: 1000,
      active: Number(values.active),
      unit_id: values.unit?.value,
      unit: undefined,
      addon: Number(1),
    };

    if (action_type === 'edit') {
      productUpdate(values, params);
    } else {
      productCreate(values, params);
    }
  };

  function productCreate(values, params) {
    productService
      .create(params)
      .then(({ data }) => {
        dispatch(
          replaceMenu({
            id: `product-${data.uuid}`,
            url: `product/${data.uuid}`,
            name: t('add.product'),
            data: values,
            refetch: false,
          })
        );
        navigate(`/addon/${data.uuid}?step=1`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  }

  function productUpdate(values, params) {
    productService
      .update(uuid, params)
      .then(() => {
        dispatch(
          setMenuData({
            activeMenu,
            data: values,
          })
        );
        next();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  }

  function fetchUnits() {
    const params = {
      perPage: 100,
      page: 1,
      active: 1,
    };
    unitService.getAll(params).then(({ data }) => setUnits(formatUnits(data)));
  }

  useEffect(() => {
    fetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatUnits(data) {
    return data.map((item) => ({
      label: item.translation?.title,
      value: item.id,
    }));
  }

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={{ active: true, ...activeMenu.data }}
      onFinish={onFinish}
      className={'addon-menu'}
    >
      <Row gutter={12}>
        <Col xs={24} sm={24} md={16}>
          <Card title={t('basic.info')}>
            <Row gutter={24}>
              <Col span={24}>
                {languages.map((item) => (
                  <Form.Item
                    key={'name' + item.id}
                    label={t('name')}
                    name={`title[${item.locale}]`}
                    rules={[
                      {
                        validator(_, value) {
                          if (!value && item.locale === defaultLang) {
                            return Promise.reject(new Error(t('required')));
                          } else if (value && value?.trim() === '') {
                            return Promise.reject(
                              new Error(t('no.empty.space'))
                            );
                          } else if (value?.length < 2) {
                            return Promise.reject(
                              new Error(t('must.be.at.least.2'))
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    hidden={item.locale !== defaultLang}
                  >
                    <Input />
                  </Form.Item>
                ))}
              </Col>
              <Col span={24}>
                {languages.map((item) => (
                  <Form.Item
                    key={'description' + item.id}
                    label={t('description')}
                    name={`description[${item.locale}]`}
                    rules={[
                      {
                        validator(_, value) {
                          if (!value && item.locale === defaultLang) {
                            return Promise.reject(new Error(t('required')));
                          } else if (value && value?.trim() === '') {
                            return Promise.reject(
                              new Error(t('no.empty.space'))
                            );
                          } else if (value?.length < 5) {
                            return Promise.reject(
                              new Error(t('must.be.at.least.5'))
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    hidden={item.locale !== defaultLang}
                  >
                    <TextArea rows={4} span={4} />
                  </Form.Item>
                ))}
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('tax')}
                  name='tax'
                  rules={[{ required: true, message: t('required') }]}
                >
                  <InputNumber min={0} className='w-100' addonAfter='%' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('active')}
                  name='active'
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card title={t('addition')}>
            <Form.Item
              label={t('unit')}
              name='unit'
              rules={[{ required: true, message: t('required') }]}
            >
              <Select
                labelInValue={true}
                filterOption={false}
                options={units}
              />
            </Form.Item>

            <Form.Item label={t('qr.code')} name='bar_code'>
              <Input className='w-100' />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('next')}
      </Button>
    </Form>
  );
};

export default ProductsIndex;
