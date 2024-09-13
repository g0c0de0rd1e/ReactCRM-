import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Modal, Row, Steps, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import orderService from 'services/order';
import Loading from 'components/loading';
import { BsCalendar2Day, BsCheckLg } from 'react-icons/bs';
import { shallowEqual, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import FaUser from 'assets/images/user.jpg';
import FaStore from 'assets/images/shop.png';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { MdRestaurant } from 'react-icons/md';
import { IoBicycleSharp, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import 'leaflet/dist/leaflet.css';

const { Step } = Steps;

const User = ({ lat, lng }) => (
  <Marker
    position={[lat, lng]}
    icon={L.icon({
      iconUrl: FaUser,
      iconSize: [50, 50],
    })}
  />
);

const Store = ({ lat, lng }) => (
  <Marker
    position={[lat, lng]}
    icon={L.icon({
      iconUrl: FaStore,
      iconSize: [50, 50],
    })}
  />
);

const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const ShowLocationsMap = ({ id, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const center = getDefaultLocation(settings);
  const [current, setCurrent] = useState(0);
  const [shop, setShop] = useState(getDefaultLocation(settings));
  const [user, setUser] = useState(getDefaultLocation(settings));
  const [steps, setSteps] = useState([
    { id: 0, name: 'new', icon: <ShoppingCartOutlined /> },
    { id: 1, name: 'accepted', icon: <BsCheckLg /> },
    { id: 2, name: 'ready', icon: <MdRestaurant /> },
    { id: 3, name: 'on_a_way', icon: <IoBicycleSharp /> },
    { id: 4, name: 'delivered', icon: <IoCheckmarkDoneSharp /> },
  ]);

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        setSteps(
          data.status === 'canceled'
            ? [
                { id: 1, name: 'new', icon: <ShoppingCartOutlined /> },
                { id: 5, name: 'canceled', icon: <AiOutlineCloseCircle /> },
              ]
            : steps,
        );
        setCurrent(
          data.status === 'canceled'
            ? 1
            : steps.find((item) => item.name === data.status)?.id,
        );

        setStatus(data.status === 'canceled' ? 'error' : 'success');
        setData(data);
        setUser({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });
        setShop({
          lat: data.shop.location.latitude,
          lng: data.shop.location.longitude,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FitBounds = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds);
      }
    }, [map, bounds]);
    return null;
  };

  const bounds = L.latLngBounds([shop, user]);

  return (
    <>
      <Modal
        visible={!!id}
        title={t('show.locations')}
        onCancel={() => handleCancel()}
        style={{ minWidth: '80vw' }}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
        ]}
      >
        {loading ? (
          <Loading />
        ) : (
          <Card>
            <Steps current={current} status={status} className='mb-5'>
              {steps?.map((item, index) => (
                <Step
                  title={t(item.name)}
                  key={item.id + index}
                  icon={item?.icon}
                />
              ))}
            </Steps>
            <Row gutter={12}>
              <Col span={12}>
                <h3>
                  {t('order.id')} #{data?.id}
                </h3>
                <p>
                  <BsCalendar2Day /> {data?.created_at}
                </p>
                <p>
                  {t('schedulet.at')} {data?.delivery_date}
                </p>
                <span>
                  <strong>{data?.shop?.translation?.title}</strong>{' '}
                  {data?.details?.map((details, index) => (
                    <Tag color={colors[index]}>
                      {details?.stock?.product.translation.title}
                    </Tag>
                  ))}
                </span>
              </Col>
              <Col span={12}>
                <p>
                  {t('status')}{' '}
                  {data?.status === 'new' ? (
                    <Tag color='blue'>{t(data?.status)}</Tag>
                  ) : data?.status === 'canceled' ? (
                    <Tag color='error'>{t(data?.status)}</Tag>
                  ) : (
                    <Tag color='cyan'>{t(data?.status)}</Tag>
                  )}
                </p>
                <p>
                  {t('payment.method')}{' '}
                  <strong>{data?.transaction?.payment_system?.tag}</strong>
                </p>
                <p>
                  {t('order.type')} <strong>{data?.delivery_type}</strong>
                </p>
                <p>
                  {t('payment.type')}{' '}
                  <strong>{data?.transaction?.status}</strong>
                </p>
              </Col>

              <Col span={24} className='mt-5'>
                <h4>{t('map')}</h4>
                <div
                  className='map-container'
                  style={{ height: 400, width: '100%' }}
                >
                  <MapContainer
                    center={center}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBounds bounds={bounds} />
                    <Store lat={shop?.lat} lng={shop?.lng} />
                    <User lat={user?.lat} lng={user?.lng} />
                  </MapContainer>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>
    </>
  );
};

export default ShowLocationsMap;
