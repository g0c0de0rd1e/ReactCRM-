import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchSellerProducts } from '../../../redux/slices/product';
import productService from '../../../services/seller/product';

const UpdateProduct = ({
  isModalOpen,
  handleCancel,
  id,
  paramsData,
  setId,
}) => {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleUpdate = () => {
    setLoadingBtn(true);
    const body = {
      products: id.parent_id,
    };
    productService
      .sync(body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(fetchSellerProducts(paramsData));
        handleCancel();
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal closable={false} visible={!!isModalOpen} footer={null} centered>
      <p>{'Do you really want to update the products?'}</p>
      <div className='d-flex justify-content-end'>
        <Button
          type='primary'
          className='mr-2'
          onClick={handleUpdate}
          loading={loadingBtn}
        >
          {t('yes')}
        </Button>
        <Button onClick={handleCancel}>{t('no')}</Button>
      </div>
    </Modal>
  );
};

export default UpdateProduct;
