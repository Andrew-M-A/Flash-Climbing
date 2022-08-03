import React from 'react';
import { RenderMap } from './render-map';
import AppContext from '../lib/app-context';

export default class HomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 33.63487,
      lng: -117.74045,
      gymInfo: [],
      currentPosition: null,
      destination: null,
      directions: null
    };
  }

  mapClick = e => {
    this.setState({ markerPos: e.latLng });
  };

  getDirections = () => {
    const directionsService = new window.google.maps.DirectionsService();

    const origin = this.state.currentPosition;
    const destination = this.state.destination;

    if (origin !== null && destination !== null) {
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } else {
      // console.log('Please pick a destination!');
    }
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          currentPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      });
    }
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
