import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import moment from 'moment';

// Ant design imports & icons
import { Button, Space, Card, DatePicker } from 'antd';
import { ClearOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { CgExport } from 'react-icons/cg';

// Redux imports
import {
  addMenu,
  disableRefetch,
  setMenu,
  setMenuData,
} from '../../redux/slices/menu';
import {
  clearItems,
  fetchAcceptedOrders,
  fetchCanceledOrders,
  fetchDeliveredOrders,
  fetchNewOrders,
  fetchOnAWayOrders,
  fetchOrders,
  fetchReadyOrders,
} from '../../redux/slices/orders';
import {
  fetchRestOrderStatus,
  fetchOrderStatus,
} from '../../redux/slices/orderStatus';
import { clearOrder } from '../../redux/slices/order';

// Helpers imports
import useDidUpdate from '../../helpers/useDidUpdate';
import { Context } from '../../context/context';
import { export_url } from '../../configs/app-global';

// Components imports
import SearchInput from '../../components/search-input';
import { DebounceSelect } from '../../components/search';
import OrderDeliveryman from './orderDeliveryman';
import ShowLocationsMap from './show-locations.map';
import Incorporate from './dnd/Incorporate';
import OrderTypeSwitcher from './order-type-switcher';

// Modal imports
import DownloadModal from './downloadModal';
import OrderStatusModal from './orderStatusModal';
import CustomModal from '../../components/modal';

// Services imports
import userService from '../../services/user';
import orderService from '../../services/order';
import shopService from '../../services/restaurant';

const { RangePicker } = DatePicker;

export default function OrderBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { type } = useParams();

  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual
  );

  const [orderDetails, setOrderDetails] = useState(null);
  const [locationsMap, setLocationsMap] = useState(null);
  const [dowloadModal, setDowloadModal] = useState(null);
  const [downloading, setDownLoading] = useState(false);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const [tabType, setTabType] = useState(null);

  const goToEdit = (row) => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `order/${row.id}`,
        id: 'order_edit',
        name: t('edit.order'),
      })
    );
    navigate(`/order/${row.id}`);
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/order/details/${row.id}`);
  };

  const goToOrderCreate = () => {
    dispatch(clearOrder());
    dispatch(
      setMenu({
        id: 'pos.system_01',
        url: 'pos-system',
        name: 'pos.system',
      })
    );
    navigate('/pos-system');
  };

  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const data = activeMenu?.data;

  const paramsData = {
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage || 5,
    page: data?.page || 1,
    user_id: data?.client?.value,
    status: data?.role !== 'deleted_at' && data?.role,
    shop_id:
      activeMenu.data?.shop?.value !== null
        ? activeMenu.data?.shop?.value
        : null,
    delivery_type: type !== 'scheduled' ? type : undefined,
    delivery_date_from:
      type === 'scheduled'
        ? moment().add(1, 'day').format('YYYY-MM-DD')
        : undefined,
    date_from: dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
    date_to: dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrderAllItem();
    }, 20000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const orderDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    orderService
      .delete(params)
      .then(() => {
        dispatch(clearItems());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        fetchOrderAllItem({ status: tabType });
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    dispatch(clearItems());
    fetchOrderAllItem();
  }, [data, dateRange]);

  const excelExport = () => {
    setDownLoading(true);
    orderService
      .export(paramsData)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownLoading(false));
  };

  const handleFilter = (item, name) => {
    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: { ...data, ...{ [name]: item } },
        })
      );
    });
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.search(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    });
  }

  const handleCloseModal = () => {
    setOrderDetails(null);
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    setDowloadModal(null);
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  const fetchOrdersCase = (params, isWithoutFilters) => {
    const paramsWithType = {
      ...params,
      delivery_type: type !== 'scheduled' ? type : undefined,
      delivery_date_from:
        type === 'scheduled'
          ? moment().add(1, 'day').format('YYYY-MM-DD')
          : undefined,

      search: data?.search ? data.search : undefined,
      user_id: data?.client?.value,
      status: params?.status,
      shop_id:
        activeMenu.data?.shop?.value !== null
          ? activeMenu.data?.shop?.value
          : null,
      // giving undefined value for date if isWithoutFilters is true
      date_from: isWithoutFilters
        ? undefined
        : dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
      date_to: isWithoutFilters
        ? undefined
        : dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    };
    switch (params?.status) {
      case 'new':
        dispatch(fetchNewOrders(paramsWithType));
        break;
      case 'accepted':
        dispatch(fetchAcceptedOrders(paramsWithType));
        break;
      case 'ready':
        dispatch(fetchReadyOrders(paramsWithType));
        break;
      case 'on_a_way':
        dispatch(fetchOnAWayOrders(paramsWithType));
        break;
      case 'delivered':
        dispatch(fetchDeliveredOrders(paramsWithType));
        break;
      case 'canceled':
        dispatch(fetchCanceledOrders(paramsWithType));
        break;
      default:
        console.log(`Sorry, we are out of`);
    }
  };

  const fetchOrderAllItem = () => {
    dispatch(clearItems());
    fetchOrdersCase({ status: 'new' });
    fetchOrdersCase({ status: 'accepted' });
    fetchOrdersCase({ status: 'ready' });
    fetchOrdersCase({ status: 'on_a_way' });
    fetchOrdersCase({ status: 'delivered' });
    fetchOrdersCase({ status: 'canceled' });
  };

  const handleClear = () => {
    // clear time range input value
    setDateRange(null);

    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: null,
        })
      );
    });
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(clearItems());
      dispatch(fetchOrders(paramsData));
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchOrderStatus());
      dispatch(fetchRestOrderStatus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu?.refetch]);

  return (
    <>
      <Space className='w-100 justify-content-end mb-3'>
        <OrderTypeSwitcher listType='orders-board' />
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={goToOrderCreate}
          style={{ width: '100%' }}
        >
          {t('add.order')}
        </Button>
      </Space>
      <Card>
        <Space wrap className='order-filter' size={[8, 15]}>
          <SearchInput
            defaultValue={data?.search}
            resetSearch={!data?.search}
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <DebounceSelect
            placeholder={t('select.shop')}
            fetchOptions={fetchShops}
            style={{ width: '100%' }}
            onClear={() => dispatch(clearItems())}
            onSelect={(shop) => handleFilter(shop, 'shop')}
            onDeselect={() => handleFilter(null, 'shop')}
            allowClear={true}
            value={data?.shop?.label}
          />
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(client) => handleFilter(client, 'client')}
            onDeselect={() => handleFilter(null, 'client')}
            style={{ width: '100%' }}
            value={data?.client?.label}
          />
          <RangePicker
            defaultValue={dateRange}
            value={dateRange}
            onChange={(values) => {
              handleFilter(JSON.stringify(values), 'data_time');
              setDateRange(values);
            }}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
            allowClear={true}
            style={{ width: '100%' }}
          />
          <Button
            onClick={excelExport}
            loading={downloading}
            style={{ width: '100%' }}
          >
            <CgExport className='mr-2' />
            {t('export')}
          </Button>
          <Button
            disabled={!activeMenu?.data}
            icon={<ClearOutlined />}
            onClick={handleClear}
            style={{ width: '100%' }}
          >
            {t('clear')}
          </Button>
        </Space>
      </Card>

      <Incorporate
        goToEdit={goToEdit}
        goToShow={goToShow}
        fetchOrderAllItem={fetchOrderAllItem}
        fetchOrders={fetchOrdersCase}
        setLocationsMap={setLocationsMap}
        setId={setId}
        setIsModalVisible={setIsModalVisible}
        setText={setText}
        setDowloadModal={setDowloadModal}
        type={type}
        setTabType={setTabType}
      />

      {orderDetails && (
        <OrderStatusModal
          orderDetails={orderDetails}
          handleCancel={handleCloseModal}
          status={statusList}
        />
      )}
      {orderDeliveryDetails && (
        <OrderDeliveryman
          orderDetails={orderDeliveryDetails}
          handleCancel={handleCloseModal}
        />
      )}
      {locationsMap && (
        <ShowLocationsMap id={locationsMap} handleCancel={handleCloseModal} />
      )}
      {dowloadModal && (
        <DownloadModal id={dowloadModal} handleCancel={handleCloseModal} />
      )}
      <CustomModal
        click={orderDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </>
  );
}
