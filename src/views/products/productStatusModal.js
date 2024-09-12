import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import productService from '../../services/product';
import { disableRefetch } from '../../redux/slices/menu';
import { fetchProducts } from '../../redux/slices/product';

const allStatuses = ['published', 'pending', 'unpublished'];

export default function ProductStatusModal({
  orderDetails: data,
  handleCancel,
  paramsData,
}) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values, status };

    productService
      .updateStatus(data.uuid, params)
      .then(() => {
        handleCancel();
        dispatch(fetchProducts(paramsData));
        dispatch(disableRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={data.title}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ status: data.status, status_note: data?.status_note }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('status')}
              name='status'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select
                value={status}
                onChange={(value) => {
                  console.log(status, form.getFieldValue('status'));
                  setStatus(value);
                }}
              >
                {allStatuses.map((item, idx) => {
                  return (
                    <Select.Option key={item + idx} value={item}>
                      {t(item)}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {(status === 'unpublished' || status === 'decline') && (
              <Form.Item
                name='status_note'
                label={t('note')}
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea maxLength={250} showCount />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
