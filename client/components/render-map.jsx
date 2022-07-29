import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import AppContext from '../lib/app-context';

let center = {
  lat: 33.63487, lng: -117.74045
};
const key = process.env.GOOGLE_MAPS_API_KEY;

export class RenderMap extends React.Component {
  render() {

    const { lat, lng } = this.context;
    center = { lat, lng };

    return (
      <LoadScript googleMapsApiKey={key}>
      <GoogleMap
      mapContainerClassName='map-container'
      center={center}
      zoom={11}>
      <Marker position={center}/>
      </GoogleMap>
      </LoadScript>
    );
  }
}

RenderMap.contextType = AppContext;