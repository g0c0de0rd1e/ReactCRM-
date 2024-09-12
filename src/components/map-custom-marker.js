import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { shallowEqual, useSelector } from 'react-redux';

export default function MapCustomMarker({ center, handleLoadMap, children }) {
  const mapContainerRef = useRef(null);
  const { maplibre_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [center.lng, center.lat],
      zoom: 12,
    });

    map.on('load', () => {
      handleLoadMap(map, maplibregl);
    });

    return () => map.remove();
  }, [center, handleLoadMap]);

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
}
