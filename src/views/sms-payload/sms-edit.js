import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import smsService from '../../services/smsGateways';
import { fetchSms } from '../../redux/slices/sms-geteways';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { disableRefetch, removeFromMenu } from '../../redux/slices/menu';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../../components/loading';

export default function SmsPayloadEdit() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { type } = useParams();

  const fetchBrand = (type) => {
    setLoading(true);
    smsService
      .getById(type)
      .then((res) => {
        console.log('res', res.data);
        const data = res.data;
        form.setFieldsValue({
          default: Boolean(data?.default),
          twilio_account_id: data?.payload?.twilio_account_id,
          twilio_auth_token: data?.payload?.twilio_auth_token,
          twilio_number: data?.payload?.twilio_number,
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const data = {
      type: 'twilio',
      default: Number(!!values?.default),
      payload: {
        twilio_account_id: values?.twilio_account_id,
        twilio_auth_token: values?.twilio_auth_token,
        twilio_number: values?.twilio_number,
      },
    };
    const nextUrl = 'settings/sms-payload';
    smsService
      .update(type, data)
      .then(() => {
        dispatch(fetchSms());
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchBrand(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.sms.payload')} className='h-100'>
      {loading ? (
        <Loading />
      ) : (
        <Form
          name='email-provider-add'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={{
            smtp_debug: true,
            smtp_auth: true,
            active: true,
            ...activeMenu.data,
          }}
          className='d-flex flex-column h-100'
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label={'twilio_account_id'}
                name='twilio_account_id'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input className='w-100' />
              </Form.Item>
              <Form.Item
                label='twilio_auth_token'
                name='twilio_auth_token'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input min={0} className='w-100' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label='twilio_number'
                name='twilio_number'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label='default' name='default' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <div className='flex-grow-1 d-flex flex-column justify-content-end'>
            <div className='pb-5'>
              <Button type='primary' htmlType='submit' loading={loadingBtn}>
                {t('submit')}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Card>
  );
}
