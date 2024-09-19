import React, { useEffect, useState, useContext } from 'react';
import { Button, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClearOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchCookingOrders, fetchOrders, handleSearch } from '../../../redux/slices/waiterOrder';
import SearchInput from '../../../components/search-input';
import { fetchRestOrderStatus } from '../../../redux/slices/orderStatus';
import { Context } from '../../../context/context';
import { toast } from 'react-toastify';
import orderService from '../../../services/waiter/order';
import Incorporate from './dnd/Incorporate';
import {
  clearItems,
  fetchAcceptedOrders,
  fetchCanceledOrders,
  fetchDeliveredOrders,
  fetchNewOrders,
  fetchReadyOrders,
} from '../../../redux/slices/waiterOrder';
import { batch } from 'react-redux';
import OrderDeliveryman from './orderDeliveryman';
import ShowLocationsMap from './show-locations.map';
import DownloadModal from './downloadModal';
import CustomModal from '../../../components/modal';
import { DebounceSelect } from 'components/search';
import bookingTable from 'services/booking-table';

export default function SellerOrdersBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [id, setId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [locationsMap, setLocationsMap] = useState(null);
  const [dowloadModal, setDowloadModal] = useState(null);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const [type, setType] = useState(null);
  
  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `waiter/order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/waiter/order/details/${row.id}`);
  };

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const data = activeMenu?.data;

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
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        fetchOrderAllItem({ status: type });
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    const paramsData = {
      search: data?.search,
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
      user_id: data?.userId,
      status: data?.status,
      table_id: data?.table_id,
    };
    dispatch(handleSearch(paramsData));
  }, [data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      const params = {
        status: data?.status,
        perPage: 10,
      };
      dispatch(fetchOrders(params));
      dispatch(fetchRestOrderStatus());
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu?.refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrderAllItem();
    }, 20000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  const fetchOrdersCase = (params) => {
    params.table_id = data?.table_id;
    switch (params.status) {
      case 'new':
        dispatch(fetchNewOrders(params));
        break;
      case 'accepted':
        dispatch(fetchAcceptedOrders(params));
        break;
      case 'ready':
        dispatch(fetchReadyOrders(params));
        break;
       case 'cooking':
        dispatch(fetchCookingOrders(params));
        break;
      case 'delivered':
        dispatch(fetchDeliveredOrders(params));
        break;
      case 'canceled':
        dispatch(fetchCanceledOrders(params));
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
    fetchOrdersCase({ status: 'cooking' });
    fetchOrdersCase({ status: 'delivered' });
    fetchOrdersCase({ status: 'canceled' });
  };

  const handleClear = () => {
    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: null,
        })
      );
    });
    fetchOrderAllItem();
  };

  const handleCloseModal = () => {
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    setDowloadModal(null);
  };

  async function getTables(search) {
    const params = {
      search,
      perPage: 10,
    };
    return bookingTable.getAllRestTables(params).then(({ data }) => {
      return data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    });
  }

  return (
    <>
      <Card>
        <Space wrap>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
            defaultValue={activeMenu.data?.search}
          />
      <DebounceSelect
            placeholder={t('select.table')}
            fetchOptions={getTables}
            onSelect={(user) => handleFilter(user.value, 'table_id')}
            onDeselect={() => handleFilter(null, 'table_id')}
            style={{ minWidth: 200 }}
          />
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            {t('clear')}
          </Button>
        </Space>
      </Card>

      <Incorporate
        goToShow={goToShow}
        fetchOrderAllItem={fetchOrderAllItem}
        fetchOrders={fetchOrdersCase}
        setLocationsMap={setLocationsMap}
        setId={setId}
        setIsModalVisible={setIsModalVisible}
        setText={setText}
        setDowloadModal={setDowloadModal}
        type={type}
        setType={setType}
      />
      <CustomModal
        click={orderDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
        setActive={setId}
      />
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
    </>
  );
}
