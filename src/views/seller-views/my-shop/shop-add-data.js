import React, { useState } from 'react';
import { Card, Col, Form, Input, InputNumber, Row, Select, Switch } from 'antd';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { DebounceSelect } from '../../../components/search';
import TextArea from 'antd/es/input/TextArea';
import userService from '../../../services/user';
import { shallowEqual, useSelector } from 'react-redux';
import Map from '../../../components/map';
import { useTranslation } from 'react-i18next';
import MediaUpload from '../../../components/upload';
import { MAP_API_KEY } from 'configs/app-global';
import getAddress from 'helpers/getAddress';

const ShopAddData = ({
  logoImage,
  setLogoImage,
  backImage,
  setBackImage,
  form,
  location,
  setLocation,
}) => {
  const { t } = useTranslation();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: MAP_API_KEY,
      libraries: ['places', 'geocode'],
    });
  const [value, setValue] = useState('');

  async function fetchUserList(search) {
    const params = { search, 'roles[0]': 'user' };
    return userService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.firstname + ' ' + (item.lastname || ''),
        value: item.id,
      }))
    );
  }

  return (
    <Row gutter={12}>
      <Col span={24}>
        <Card>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={t('logo.image')}
                name='images'
                rules={[
                  {
                    required: logoImage?.length === 0,
                    message: t('required'),
                  },
                ]}
              >
                <MediaUpload
                  type='shops/logo'
                  imageList={logoImage}
                  setImageList={setLogoImage}
                  form={form}
                  multiple={false}
                  name='logo_img'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('background.image')}
                name='images'
                rules={[
                  {
                    required: backImage?.length === 0,
                    message: t('required'),
                  },
                ]}
              >
                <MediaUpload
                  type='shops/background'
                  imageList={backImage}
                  setImageList={setBackImage}
                  form={form}
                  multiple={false}
                  name='background_img'
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={t('status.note')} name='status_note'>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name='status' label={t('status')}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t('visibility')}
                name='visibility'
                valuePropName='checked'
              >
                <Switch disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('delivery')}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name='price'
                label={t('min.price')}
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.0'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='price_per_km'
                label={t('price.per.km')}
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.0'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card title={t('general')}>
          <Row gutter={12}>
            <Col span={8}>
              {languages.map((item, idx) => (
                <Form.Item
                  key={'title' + idx}
                  label={t('title')}
                  name={`title[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    { min: 2, message: t('title.required') },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Input />
                </Form.Item>
              ))}
            </Col>
            <Col span={8} hidden>
              <Form.Item
                label={t('seller')}
                name='user'
                rules={[{ required: true, message: t('required') }]}
              >
                <DebounceSelect fetchOptions={fetchUserList} disabled />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={t('phone')}
                name='phone'
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(new Error(t('must.be.positive')));
                      } else if (value?.toString().length < 7) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.7'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            <Col span={16}>
              {languages.map((item, idx) => (
                <Form.Item
                  key={'desc' + idx}
                  label={t('description')}
                  name={`description[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    { min: 2, message: t('title.required') },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <TextArea rows={4} />
                </Form.Item>
              ))}
            </Col>
          </Row>
        </Card>

        <Card title={t('order.info')}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={t('min.amount')}
                name='min_amount'
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.0'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('tax')}
                name='tax'
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0 || value > 100) {
                        return Promise.reject(
                          new Error(t('must.be.between.0.and.100'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber addonAfter={'%'} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('admin.comission')}
                name='percentage'
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0 || value > 100) {
                        return Promise.reject(
                          new Error(t('must.be.between.0.and.100'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' addonAfter={'%'} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('delivery.time')}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name='delivery_time_type'
                label={t('delivery_time_type')}
                rules={[{ required: true, message: t('required') }]}
              >
                <Select className='w-100'>
                  <Select.Option value='minute' label={t('minute')} />
                  <Select.Option value='day' label={t('day')} />
                  <Select.Option value='month' label={t('month')} />
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='delivery_time_from'
                label={t('delivery_time_from')}
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.0'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='delivery_time_to'
                label={t('delivery_time_to')}
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.0'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card title={t('address')}>
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item, idx) => (
                <Form.Item
                  key={'address' + idx}
                  label={t('address')}
                  name={`address[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Select
                    allowClear
                    searchValue={value}
                    showSearch
                    autoClearSearchValue
                    loading={isPlacePredictionsLoading}
                    options={placePredictions?.map((prediction) => ({
                      label: prediction.description,
                      value: prediction.description,
                    }))}
                    onSearch={(searchValue) => {
                      setValue(searchValue);
                      if (searchValue.length > 0) {
                        getPlacePredictions({ input: searchValue });
                      }
                    }}
                    onSelect={async (value) => {
                      const address = await getAddress(value);
                      setLocation({
                        lat: address?.geometry.location.lat,
                        lng: address?.geometry.location.lng,
                      });
                    }}
                  />
                </Form.Item>
                
              ))}
            </Col>
            <Col span={24}>
              <Map
                location={location}
                setLocation={setLocation}
                setAddress={(value) =>
                  form.setFieldsValue({ [`address[${defaultLang}]`]: value })
                }
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ShopAddData;
