import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import FaUser from '../../assets/images/user.jpg';
import getDefaultLocation from '../../helpers/getDefaultLocation';

const User = () => (
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)',
    }}
  >
    <img src={FaUser} width='50' alt='Pin' />
  </div>
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

  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [center.lng, center.lat],
      zoom: 10,
    });

    if (data?.delivery_man_setting) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${FaUser})`;
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = '100%';

      new maplibregl.Marker(el)
        .setLngLat([user.lng, user.lat])
        .addTo(map);
    }

    return () => map.remove();
  }, [center, data, user]);

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
        <div className='map-container' style={{ height: 400, width: '100%' }} ref={mapContainerRef}></div>
      </Modal>
    </>
  );
};

export default ShowLocationsMap;
