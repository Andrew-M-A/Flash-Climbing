import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import AppContext from '../lib/app-context';

const key = process.env.GOOGLE_MAPS_API_KEY;

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
    this.handleClick = this.handleClick.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
  }

  renderMarkers(gyms) {
    return gyms.map((coordinates, i) => {
      const coords = {
        lat: gyms[i].coordinates.latitude,
        lng: gyms[i].coordinates.longitude
      };
      const title = gyms[i].name;
      return (<Marker
        icon={{
          url: 'https://cdn2.iconfinder.com/data/icons/wsd-map-markers-2/512/wsd_markers_72-512.png',
          scaledSize: new window.google.maps.Size(45, 45)
        }}
        onClick={this.handleClick}
        key={gyms[i].id}
        position={coords}
        title={title}
        animation={window.google.maps.Animation.DROP}
      />);
    });
  }

  handleClick(event) {
    this.setState({
      destination: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
    });
  }

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
    const center = {
      lat: this.state.lat,
      lng: this.state.lng
    };
    return (
        <LoadScript googleMapsApiKey={key}>
          <GoogleMap
            mapContainerClassName='map-container'
            center={center}
            zoom={10}
            options={{
              mapTypeControl: false
            }}>
            <Marker
              onClick={this.handleClick}
              position={center}
              title="LFZ BAYBEEE"
            />
            {this.renderMarkers(this.state.gymInfo)}
          </GoogleMap>
        </LoadScript>

    );
  }
}

HomeMap.contextType = AppContext;
