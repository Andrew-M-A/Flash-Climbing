import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

export default function HomeMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC3q7FbfvJEgmnvm2Lq2dMKurjfBFqWQb0'
  });
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return <Map/>;
}

function Map() {
  const center = useMemo(() => ({ lat: 34.04055, lng: -118.46473 }), []);
  return <GoogleMap
  zoom={10}
  center={{ lat: 34.04055, lng: -118.46473 }}
  mapContainerClassName = 'map-container'>
    <Marker position={center} />
  </GoogleMap>;
}
