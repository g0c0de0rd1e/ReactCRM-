import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import useDemo from '../../helpers/useDemo';
import booking from 'services/booking';

export default function BookingShowModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { isDemo } = useDemo();

  function fetchBooking(id) {
    setLoading(true);
    booking
      .getById(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchBooking(id);
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('reservation')}
      onCancel={handleCancel}
      footer={[
        <Button key='cancel' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <Descriptions bordered>
          <Descriptions.Item span={3} label={t('id')}>
            {data.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('client')}>
            {data.user?.firstname || ''} {data.user?.lastname || ''}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('phone')}>
            {isDemo ? '' : data.user?.phone}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('number.of.guests')}>
            {data.table?.chair_count}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('table')}>
            {data.table?.name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('status')}>
            {data.status === 'new' ? (
              <Tag color='blue'>{t(data.status)}</Tag>
            ) : data.status === 'canceled' ? (
              <Tag color='error'>{t(data.status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(data.status)}</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('date.time')}>
            {data.start_date}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
