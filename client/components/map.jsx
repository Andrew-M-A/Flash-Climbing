import React from 'react';
import { RenderMap } from './render-map';
import AppContext from '../lib/app-context';

export default class HomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 33.63487,
      lng: -117.74045,
      gymInfo: []
    };
  }

  componentDidMount() {
    fetch(`/api/climbing?lat=${this.state.lat}&lng=${this.state.lng}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        for (let i = 0; i < result.length; i++) {
          const { name, coordinates, id } = result[i];
          const gyms = {
            name,
            coordinates,
            id
          };
          this.state.gymInfo.push(gyms);
        }
      });
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
    const { lat, lng, gymInfo } = this.state;
    const contextValue = { lat, lng, gymInfo };
    return (
    <AppContext.Provider value={contextValue}>
    <RenderMap />
    </AppContext.Provider>
    );
  }
}

HomeMap.contextType = AppContext;
