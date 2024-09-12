import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Context } from '../../context/context';
import { useTranslation } from 'react-i18next';
import { disableRefetch } from '../../redux/slices/menu';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchSms } from '../../redux/slices/sms-geteways';
import { useNavigate } from 'react-router-dom';
import { addMenu } from '../../redux/slices/menu';
import DeleteButton from '../../components/delete-button';

export default function SmsGateways() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { smsGatewaysList, loading } = useSelector(
    (state) => state.sms,
    shallowEqual,
  );

  const goToEdit = (type) => {
    dispatch(
      addMenu({
        id: 'sms-payload-edit',
        url: `settings/sms-payload/${type}`,
        name: t('edit.sms.payload'),
      }),
    );
    navigate(`/settings/sms-payload/${type}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'sms-payload-add',
        url: 'settings/sms-payload/add',
        name: t('add.sms.payload'),
      }),
    );
    navigate('/settings/sms-payload/add');
  };

  const columns = [
    {
      title: t('type'),
      dataIndex: 'type',
      width: '30%',
    },
    {
      title: t('twilio.number'),
      dataIndex: 'twilio_number',
      render: (_, row) => row.payload?.twilio_number,
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row.type)}
              disabled={row?.deleted_at}
            />
            {/*<DeleteButton*/}
            {/*  disabled={row.deleted_at}*/}
            {/*  icon={<DeleteOutlined />}*/}
            {/*  onClick={() => {*/}
            {/*    setId([row.id]);*/}
            {/*    setIsModalVisible(true);*/}
            {/*  }}*/}
            {/*/>*/}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSms());
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('sms.payload')}
      extra={
        <Space>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.sms.payload')}
          </Button>
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={smsGatewaysList}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
}
