import React, { useMemo, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

export default function HomeMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC3q7FbfvJEgmnvm2Lq2dMKurjfBFqWQb0'
  });
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
  <>
  <Map/>
  <Locate/>
  </>
  );
}

// golden palace: lat: 34.04055, lng: -118.46473

function Map() {
  const center = useMemo(() => ({ lat: 33.63487, lng: -117.74045 }), []);
  return <GoogleMap
  onDragEnd={HandleDrag}
  zoom={11}
  center={{ lat: 33.63487, lng: -117.74045 }}
  mapContainerClassName = 'map-container'>
    <Marker position={center} />
  </GoogleMap>;
}

function Locate() {
  const [lat, setLat] = useState([]);
  const [lng, setLng] = useState([]);
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
    // console.log('Latitude is: ', lat);
    // console.log('Longitude is: ', lng);
  }, [lat, lng]);
}

function HandleDrag() {
  // console.log(navigator);
}
