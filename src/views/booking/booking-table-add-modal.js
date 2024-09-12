import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
} from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import BookingTable from 'services/booking-table';
import BookingZone from 'services/booking-zone';
import { RefetchSearch } from 'components/refetch-search';
import { AppstoreOutlined } from '@ant-design/icons';
import BookingZoneAddModal from './booking-zone-add-modal';
import { useDispatch } from 'react-redux';
import { setBookingData } from 'redux/slices/booking';
import { fetchAdminBookingTable } from 'redux/slices/booking-tables';

const BookingTableAddModal = ({ visible, handleCancel }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [zoneRefetch, setZoneRefetch] = useState(null);
  const [zone, setZone] = useState(null);
  const dispatch = useDispatch();
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { data } = useSelector((state) => state.booking, shallowEqual);
  const { current_zone } = useSelector(
    (state) => state.bookingZone,
    shallowEqual
  );
  const params = {
    shop_section_id: current_zone?.id,
    status: data.current_tab === 'all' ? undefined : data.current_tab,
    shop_id: myShop.id,
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      chair_count: String(values.chair_count),
      shop_section_id: values.shop_section_id.value,
      shop_id: myShop.id,
    };
    setLoadingBtn(true);
    BookingTable.create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
        dispatch(setBookingData({ reload: true }));
      })
      .finally(() => {
        setLoadingBtn(false);
        dispatch(fetchAdminBookingTable(params));
      });
  };

  function fetchZone() {
    setZoneRefetch(false);
    const params = {
      shop_id: myShop.id,
    };
    return BookingZone.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation.title,
        value: item.id,
      }))
    );
  }

  const goToAddZone = () => {
    setZone(true);
    setZoneRefetch(true);
  };

  const handleClose = () => setZone(false);

  return (
    <Modal
      title={t('add.booking.table')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          className='table_booking'
        >
          {t('confirm')}
        </Button>,
      ]}
    >
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('zona')}
              name={'shop_section_id'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <RefetchSearch
                fetchOptions={fetchZone}
                refetch={zoneRefetch}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Button
                      className='w-100'
                      size='small'
                      icon={<AppstoreOutlined />}
                      onClick={goToAddZone}
                    >
                      {t('add.booking.zone')}
                    </Button>
                  </>
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='name'
              name={`name`}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('chair.count')}
              name='chair_count'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value < 1) {
                      return Promise.reject(new Error(t('must.be.at.least.1')));
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
              label={t('tax')}
              name='tax'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value < 1) {
                      return Promise.reject(new Error(t('must.be.at.least.1')));
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
      </Form>
      {zone && (
        <BookingZoneAddModal visible={zone} handleCancel={handleClose} />
      )}
    </Modal>
  );
};

export default BookingTableAddModal;
