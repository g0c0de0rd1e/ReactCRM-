import React, { useContext, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import { adminFetchBookingTime } from 'redux/slices/booking-time';
import { useTranslation } from 'react-i18next';
import CustomModal from 'components/modal';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import BookingTime from 'services/booking-time';
import { useNavigate } from 'react-router-dom';
import RiveResult from 'components/rive-result';
import getFullDateTime from 'helpers/getFullDateTime';

const BookingTables = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const navigate = useNavigate();

  const { data, loading } = useSelector(
    (state) => state.bookingTime,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `booking/time/${row.id}`,
        id: 'booking_time_edit',
        name: t('edit.booking.time'),
      })
    );
    navigate(`/booking/time/${row.id}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        url: `booking/time/add`,
        id: 'booking_time_add',
        name: t('add.booking.time'),
      })
    );
    navigate(`/booking/time/add`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
      sorter: true,
    },
    {
      title: t('branch'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (shop) => shop?.translation?.title,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (date) => getFullDateTime(date),
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
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const bookingtableDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    BookingTime.delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(adminFetchBookingTime());
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(adminFetchBookingTime());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card>
        <Space wrap className='justify-content-end w-100'>
          <Button
            hidden={data?.length > 0}
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => goToAdd(true)}
          >
            {t('add.reservation.time')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('reservation.time')}>
        <Table
          scroll={{ x: true }}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={data}
          rowKey={(record) => record?.id}
          locale={{
            emptyText: <RiveResult id='nosell' />,
          }}
          loading={loading}
        />
      </Card>
      <CustomModal
        click={bookingtableDelete}
        text={t('delete')}
        setText={setId}
        loading={loadingBtn}
        setActive={setId}
      />
    </>
  );
};

export default BookingTables;
