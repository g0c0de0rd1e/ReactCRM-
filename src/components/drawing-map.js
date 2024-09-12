import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BiCurrentLocation } from 'react-icons/bi';

const DrawingManager = (props) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 38.58799374569842,
    lng: -98.47949767583457,
  });
  const [polygon, setPolygon] = useState(
    props.triangleCoords ? props.triangleCoords : []
  );
  const [finish, setFinish] = useState(props.triangleCoords ? true : false);
  const [focus, setFocus] = useState(null);
  props.setMerge(finish);

  const onClick = (event) => {
    setFocus(false);
    const { lngLat } = event;
    const lat = lngLat.lat;
    const lng = lngLat.lng;
    if (finish) {
      setPolygon([]);
      props.settriangleCoords([{ lat, lng }]);
      setCenter({ lat, lng });
      setFinish(false);
    } else {
      props.settriangleCoords((prev) => [...prev, { lat, lng }]);
    }
  };

  const onFinish = (e) => {
    setFinish(props.triangleCoords ? true : false);
    if (
      props.triangleCoords[0]?.lat === e.lngLat?.lat &&
      props.triangleCoords.length > 1
    ) {
      setPolygon(props.triangleCoords);
      props.setLocation(props.triangleCoords);
      setFinish(true);
      setFocus(true);
    }
  };

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [center.lng, center.lat],
        zoom: 10,
      });

      mapInstance.on('click', onClick);

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    currentLocation();
  }, [map]);

  return (
    <div className='map-container' style={{ height: 500, width: '100%' }}>
      <button
        className='map-button'
        type='button'
        onClick={() => {
          currentLocation();
        }}
      >
        <BiCurrentLocation />
      </button>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default DrawingManager;
