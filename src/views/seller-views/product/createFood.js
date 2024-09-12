import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from 'components/search';
import { addMenu, setRefetch } from 'redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import sellerProductService from 'services/seller/product';
import { useNavigate } from 'react-router-dom';

export default function CreateProduct({ isModalOpen, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    const productList =
      values.title?.length !== 0 ? values.title : values.bar_code;
    if (productList && productList.length !== 0) {
      form.validateFields(['title']).then(() => {
        const body = {
          products: productList.map((item) => item.value),
        };
        setLoading(true);
        sellerProductService
          .sync(body)
          .then((res) => {
            if (res.data.length < 2) {
              dispatch(
                addMenu({
                  id: 'product-edit',
                  url: `seller/product/${res.data[0]}`,
                  name: t('edit.product'),
                })
              );
              navigate(`/seller/product/${res.data[0]}`, { state: true });
              return;
            }
            handleCancel();
            dispatch(setRefetch(activeMenu));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      });
    }
  };

  async function fetchFood(search) {
    const params = { search, perPage: 10 };
    return sellerProductService.getAllParent(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  async function fetchFoodByBarCode(bar_code) {
    const params = { bar_code, perPage: 10 };
    return sellerProductService
      .getAllParent(params)
      .then(({ data }) =>
        data.map((item) => ({ label: item.bar_code, value: item.id }))
      );
  }

  const goToAddProduct = () => {
    dispatch(
      addMenu({
        id: 'product-add',
        url: `seller/product/add`,
        name: t('add.product'),
      })
    );
    navigate(`/seller/product/add`);
  };

  return (
    <Modal
      visible={isModalOpen}
      title={t('add.food')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          key={'saveBtn'}
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button onClick={goToAddProduct}>{t('add.new.product')}</Button>,
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
      >
        <Form.Item name='title' label={t('title')}>
          <DebounceSelect
            mode='multiple'
            fetchOptions={fetchFood}
            style={{ minWidth: 150 }}
          />
        </Form.Item>
        <Form.Item name='bar_code' label={t('search.product.bar_code')}>
          <DebounceSelect
            placeholder={t('search.product.bar_code')}
            fetchOptions={fetchFoodByBarCode}
            style={{ minWidth: 150 }}
            loading={loading}
            mode='multiple'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
