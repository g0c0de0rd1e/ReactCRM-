import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Image, Row, Space, Button, Checkbox } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Context } from '../../../context/context';
import CustomModal from '../../../components/modal';
import galleryService from '../../../services/seller/galleries';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../../components/delete-button';
import RiveResult from '../../../components/rive-result';
import CreateGalleryModal from './add-gallery-modal';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchSellerGallery } from '../../../redux/slices/galleries';
import { disableRefetch } from '../../../redux/slices/menu';

const Galleries = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [modalOpen, setIsModalOpen] = useState(null);
  const [list, setList] = useState([]);
  const [id, setID] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { gallery, loading, data } = useSelector(
    (state) => state.gallerySlice,
    shallowEqual
  );

  const imageDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...list?.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };

    galleryService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerGallery());
        setIsModalVisible(false);
        setList([]);
      })
      .finally(() => setLoadingBtn(false));
  };

  const deleteAllGalleries = () => {
    setLoadingBtn(true);
    galleryService
      .deleteAll(id)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerGallery());
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerGallery());
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  const deleteSelected = () => {
    if (list === null || list.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
    }
  };

  const handleSelect = () => setList(gallery?.map((gallary) => gallary.id));

  const handleClear = () => setList([]);

  const handleCheck = (e, data) => {
    if (e.target.checked) {
      setList([...list, parseInt(data)]);
    } else {
      setList(list.filter((item) => item !== data));
    }
  };

  return (
    <div className='gallery-item'>
      <Card
        title={
          <div className='d-flex align-items-center justify-content-end'>
            <Space>
              <Button
                icon={<PlusCircleOutlined />}
                type='primary'
                onClick={() => setIsModalOpen(true)}
              >
                {t('add.image')}
              </Button>
              <DeleteButton onClick={deleteSelected} type=''>
                {t('delete.selected')}
              </DeleteButton>
              {gallery?.length > 0 && (
                <DeleteButton
                  onClick={() => {
                    setIsModalVisible(true);
                    setID(data.id);
                  }}
                  type=''
                >
                  {t('delete.all')}
                </DeleteButton>
              )}
              <Button
                onClick={() =>
                  list?.length === gallery?.length
                    ? handleClear()
                    : handleSelect()
                }
              >
                {list?.length === gallery?.length
                  ? t('clear.all')
                  : t('select.all')}
                {}
              </Button>
            </Space>
          </div>
        }
      >
        {!loading && gallery?.length ? (
          <Row gutter={[24, 24]} className='mt-2'>
            {gallery?.length === 0 ? (
              <Col span={24}>
                <RiveResult id='nosell' />
              </Col>
            ) : (
              gallery?.map((item, index) => (
                <Col key={index}>
                  <Card
                    className={`mb-0 ${
                      item.isset ? 'card-noActive' : 'card-active'
                    } card-image`}
                  >
                    <Image
                      src={item.path}
                      className='images'
                      alt={item.title}
                    />
                    {!item.isset && (
                      <Checkbox
                        checked={list?.includes(item.id)}
                        className='icon-center-delete'
                        onChange={(e) => handleCheck(e, item.id)}
                      />
                    )}
                  </Card>
                </Col>
              ))
            )}
          </Row>
        ) : (
          <RiveResult text={t('item.not.found')} />
        )}
        <CustomModal
          click={id ? deleteAllGalleries : imageDelete}
          text={id ? t('delete.all.galleries') : t('all.delete')}
          loading={loadingBtn}
          setActive={setID}
          setText={setList}
        />
        <CreateGalleryModal
          data={modalOpen}
          handleCancel={() => setIsModalOpen(null)}
        />
      </Card>
    </div>
  );
};

export default Galleries;
