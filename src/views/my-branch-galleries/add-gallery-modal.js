import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import myGalleries from '../../services/my-branch-galleries';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MediaUpload from '../../components/upload';
import { fetchGallery } from 'redux/slices/galleries';

export default function CreateGalleryModal({ data, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = () => {
    const params = {
      active: 1,
      images: fileList.map((image) => image.name),
    };
    setLoadingBtn(true);
    myGalleries
      .create(params)
      .then(() => {
        handleCancel();
        dispatch(fetchGallery());
        setFileList([]);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('add.galleries')}
      visible={!!data}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          key='save-btn'
        >
          {t('save')}
        </Button>,
        <Button
          type='default'
          onClick={() => {
            handleCancel();
            setFileList([]);
          }}
          key='cancel-btn'
        >
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item label={t('images')} name='images'>
          <MediaUpload
            type='shop-galleries'
            imageList={fileList}
            setImageList={setFileList}
            form={form}
            multiple={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
