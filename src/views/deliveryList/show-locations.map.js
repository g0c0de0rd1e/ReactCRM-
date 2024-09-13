import React from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import FaUser from '../../assets/images/user.jpg';
import getDefaultLocation from '../../helpers/getDefaultLocation';
import 'leaflet/dist/leaflet.css';

const User = ({ lat, lng }) => (
  <Marker
    position={[lat, lng]}
    icon={L.icon({
      iconUrl: FaUser,
      iconSize: [50, 50],
    })}
  />
);

const ShowLocationsMap = ({ id: data, handleCancel }) => {
  const { t } = useTranslation();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const center = getDefaultLocation(settings);
  const user = {
    lat: data?.delivery_man_setting?.location?.latitude,
    lng: data?.delivery_man_setting?.location?.longitude,
  };

  return (
    <>
      <Modal
        visible={!!data}
        title={t('show.locations')}
        closable={false}
        style={{ minWidth: '80vw' }}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <div className='map-container' style={{ height: 400, width: '100%' }}>
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data?.delivery_man_setting !== null ? (
              <User lat={user?.lat} lng={user?.lng} />
            ) : null}
          </MapContainer>
        </div>
      </Modal>
    </>
  );
};

export default ShowLocationsMap;
