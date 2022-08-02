import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import AppContext from '../lib/app-context';

let center = {};

const key = process.env.GOOGLE_MAPS_API_KEY;

export class RenderMap extends React.Component {

  render() {

    const { lat, lng, gymInfo } = this.context;
    center = { lat, lng };

    return (
      <LoadScript googleMapsApiKey={key}>
      <GoogleMap
      mapContainerClassName='map-container'
      center={center}
      zoom={11}>
      <Marker
      position={center}
      title="LFZ BAYBEEE"
      animation={window.google.maps.Animation.BOUNCE}
      />
      {renderMarkers(gymInfo)}
      </GoogleMap>
      </LoadScript>
    );
  }
}

function renderMarkers(gyms) {
  return gyms.map((coordinates, i) => {
    const coords = {
      lat: gyms[i].coordinates.latitude,
      lng: gyms[i].coordinates.longitude
    };
    const title = gyms[i].name;
    return (<Marker
      key={i}
      position={coords}
      title={title}
      animation={window.google.maps.Animation.DROP}
      />);
  }
  );

}

RenderMap.contextType = AppContext;
