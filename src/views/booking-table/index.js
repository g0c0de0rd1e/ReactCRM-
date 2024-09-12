import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { fetchAdminBookingTable } from 'redux/slices/booking-tables';
import sellerBookingTable from 'services/booking-table';
import { Button, Card, Modal, Space, Table, Tooltip } from 'antd';
import TableQrCode from './table-qrcode';
import SearchInput from 'components/search-input';

const BookingTables = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  const paramsData = {
    shop_id: myShop.id,
    sort: data?.sort,
    column: data?.column,
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage || 10,
    page: data?.page || 1,
  };

  const { tables, meta, loading } = useSelector(
    (state) => state.bookingTable,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'booking-table-edit',
        url: `booking/table/${row.id}`,
        name: t('booking.table.edit'),
      })
    );
    navigate(`/booking/table/${row.id}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: 'booking-table-clone',
        url: `booking/table/clone/${row.id}`,
        name: t('booking.table.clone'),
      })
    );
    navigate(`/booking/table/clone/${row.id}`);
  };

  const goToAddBox = () => {
    dispatch(
      addMenu({
        id: 'booking-table-add',
        url: 'booking/table/add',
        name: t('add.booking.table'),
      })
    );
    navigate('/booking/table/add');
  };

  const openQrCode = (row) => {
    setSelectedTable(row);
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
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
      render: (_, row) => row?.name,
    },
    {
      title: t('zone'),
      key: 'name',
      is_show: true,
      render: (_, row) => row.shop_section?.translation?.title,
    },
    {
      title: t('chair.count'),
      dataIndex: 'chair_count',
      key: 'chair_count',
      is_show: true,
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
              disabled={row.deleted_at}
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row)}
              disabled={row.deleted_at}
            />
            <DeleteButton
              disabled={row.deleted_at}
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
            <Tooltip title={t('show.qrcode')}>
              <Button
                icon={<QrcodeOutlined />}
                onClick={() => openQrCode(row)}
                disabled={row.deleted_at}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);

  const brandDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    sellerBookingTable
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchAdminBookingTable(paramsData));
        setIsModalVisible(false);
        setText(null);
      })
      .finally(() => {
        setLoadingBtn(false);
        setId(null);
      });
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchAdminBookingTable(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchAdminBookingTable(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
    );
  };

  return (
    <>
      <Card className='p-0'>
        <Space wrap className='justify-content-end w-100'>
          <SearchInput
            placeholder={t('search')}
            className='w-25'
            handleChange={(e) => {
              handleFilter({ search: e });
            }}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            style={{ minWidth: 300 }}
          />

          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBox}
          >
            {t('add.booking.table')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('tables.and.qrcode')}>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={tables}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
          loading={loading}
        />
      </Card>
      <CustomModal
        click={brandDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
      <Modal
        width={400}
        visible={!!selectedTable}
        footer={null}
        onCancel={() => setSelectedTable(null)}
      >
        <TableQrCode table={selectedTable} />
      </Modal>
    </>
  );
};

export default BookingTables;
