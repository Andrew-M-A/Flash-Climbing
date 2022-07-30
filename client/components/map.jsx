import React from 'react';
import { RenderMap } from './render-map';
import AppContext from '../lib/app-context';

export default class HomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 33.63487,
      lng: -117.74045
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }

  render() {
    const { lat, lng } = this.state;
    const contextValue = { lat, lng };
    return (
    <AppContext.Provider value={contextValue}>
    <RenderMap />
    </AppContext.Provider>
    );
  }
}

HomeMap.contextType = AppContext;
