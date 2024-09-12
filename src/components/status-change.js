import React, { useState } from 'react';
import { Button, Modal, Space, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const StatusChangeModal = ({ data, handleStatusChange, handleCancel }) => {
  // shape of data = {id = string | number, status = string, options = []}
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    handleStatusChange(data?.id, params)
      .then(() => {
        handleCancel();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      visible={!!data}
      handleCancel={handleCancel}
      footer={
        <Space wrap>
          <Button
            type='primary'
            onClick={() => form.submit()}
            loading={loading}
          >
            {t('save')}
          </Button>
          <Button type='default' onClick={handleCancel}>
            {t('cancel')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ status: data?.status }}
      >
        <Form.Item name='status' label={t('status')}>
          <Select options={data?.options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StatusChangeModal;
