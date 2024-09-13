import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import pinIcon from '../assets/images/pin.png';
import getAddressFromLocation from '../helpers/getAddressFromLocation';
import { BiCurrentLocation } from 'react-icons/bi';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32],
});

function LeafletMap(props) {
  const [loc, setLoc] = useState();

  const onClickMap = async (e) => {
    const location = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
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
    currentLocation();
  }, []);

  const MapEvents = () => {
    useMapEvents({
      click: onClickMap,
    });
    return null;
  };

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
      <MapContainer
        center={props.location}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <Marker
          position={props.location}
          icon={customIcon}
          className='marker'
        />
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
