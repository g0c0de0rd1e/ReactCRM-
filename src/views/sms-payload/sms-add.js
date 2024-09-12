import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Select,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import smsService from '../../services/smsGateways';
import { fetchSms } from '../../redux/slices/sms-geteways';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const options = [{ title: 'twilio', value: 'twilio' }];

export default function SmsPayloadAdd() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [type, setType] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const data = {
      type: 'twilio',
      default: Number(!!values.default),
      payload: {
        twilio_account_id: values.twilio_account_id,
        twilio_auth_token: values.twilio_auth_token,
        twilio_number: values.twilio_number,
      },
    };
    const nextUrl = 'settings/sms-payload';
    smsService
      .create(data)
      .then(() => {
        dispatch(fetchSms());
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleChange = (value) => setType(value);

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Card
        title='add.sms.payload'
        extra={
          <Select
            style={{ width: '120px' }}
            defaultValue={'twillo'}
            onChange={handleChange}
            options={options}
          />
        }
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

        <Space>
          <Button
            type='primary'
            loading={loadingBtn}
            key='save-btn'
            htmlType='submit'
          >
            {t('save')}
          </Button>
        </Space>
      </Card>
    </Form>
  );
}
