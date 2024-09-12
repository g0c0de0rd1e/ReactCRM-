import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import getAddressFromLocation from '../helpers/getAddressFromLocation';
import { BiCurrentLocation } from 'react-icons/bi';

function MapLibreMap(props) {
  const [map, setMap] = useState(null);
  const [loc, setLoc] = useState();

  const onClickMap = async (event) => {
    const { lngLat } = event;
    const location = {
      lat: lngLat.lat,
      lng: lngLat.lng,
    };
    props.setLocation(location);
    const address = await getAddressFromLocation(location);
    props.setAddress(address);
  };

  const handleSubmit = async (event) => {
    const location = {
      lat: event?.lat,
      lng: event?.lng,
    };
    props.setLocation(location);
    const address = await getAddressFromLocation(location);
    props.setAddress(address);
  };

  const currentLocation = async () => {
    await navigator.geolocation.getCurrentPosition(function (position) {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLoc(location);
    });
  };

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [props.location.lng, props.location.lat],
        zoom: 10,
      });

      mapInstance.on('click', onClickMap);

      new maplibregl.Marker({
        element: document.createElement('div'),
        anchor: 'bottom',
      })
        .setLngLat([props.location.lng, props.location.lat])
        .addTo(mapInstance);

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    currentLocation();
  }, [map]);

  return (
    <div className='map-container' style={{ height: 400, width: '100%' }}>
      <button
        className='map-button'
        type='button'
        onClick={() => {
          currentLocation();
          handleSubmit(loc);
        }}
      >
        <BiCurrentLocation />
      </button>
      <div id='map' style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
}

export default MapLibreMap;
