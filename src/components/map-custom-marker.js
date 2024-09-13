import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { shallowEqual, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';

export default function MapCustomMarker({ center, handleLoadMap, children }) {
  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={handleLoadMap}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
