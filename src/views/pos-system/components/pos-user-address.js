import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Map from '../../../components/map';
import getDefaultLocation from '../../../helpers/getDefaultLocation';
import { setCartData } from '../../../redux/slices/cart';
import { getCartData } from '../../../redux/selectors/cartSelector';

export default function PosUserAddress({ uuid, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [currentAddress, setCurrentAddress] = useState(null);
  const data = useSelector((state) => getCartData(state.cart));
  const { currentBag } = useSelector((state) => state.cart, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );

  const [location, setLocation] = useState(
    data.address
      ? { lat: data.address?.lat, lng: data.address?.lng }
      : getDefaultLocation(settings)
  );

  const onFinish = (values) => {
    const body = {
      ...values,
      active: 1,
      lat: location.lat,
      lng: location.lng,
    };
    dispatch(
      setCartData({
        address: body,
        bag_id: currentBag,
      })
    );
    handleCancel();
  };

  useEffect(() => {
    form.setFieldsValue({
      address: currentAddress || data.address.address,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBag, currentAddress]);

  return (
    <Modal
      visible={!!uuid}
      title={t('create.address')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' key={'saveBtn'} onClick={() => form.submit()}>
          {t('save')}
        </Button>,
        <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='user-address'
        form={form}
        onFinish={onFinish}
        initialValues={{ address: currentAddress }}
      >
        <Form.Item
          name='address'
          label={t('address')}
          rules={[{ required: true, message: t('required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t('map')}>
          <Map
            location={location}
            setLocation={setLocation}
            setAddress={setCurrentAddress}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
