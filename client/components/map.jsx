import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import StarRating from './star-rating';
import Navbar from './navbar';
import AppContext from '../lib/app-context';

const key = process.env.GOOGLE_MAPS_API_KEY;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 33.63487,
      lng: -117.74045,
      gymInfo: [],
      currentPosition: null,
      destination: null,
      clickedGym: null,
      trip: {
        distance: null,
        duration: null,
        directions: null
      }
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.getDirections = this.getDirections.bind(this);
  }

  handleClick(event, gym) {
    this.setState({
      clickedGym: gym,
      destination: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
    });
  }

  getDirections() {
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
          if (status === window.google.maps.DirectionsStatus.OK && result !== null) {
            this.setState({
              trip: {
                distance: result.routes[0].legs[0].distance,
                duration: result.routes[0].legs[0].duration,
                directions: result.routes[0].legs[0].steps
              },
              directions: result
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }

  renderMarkers(gyms) {
    return gyms.map(gym => {
      const coords = {
        lat: gym.coordinates.latitude,
        lng: gym.coordinates.longitude
      };
      const title = gym.name;

      return (
          }
        </Marker>
      );
    });
  }

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
    if (!this.state.currentPosition) {
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
            const req = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: gyms.name,
                lat: gyms.coordinates.latitude,
                lng: gyms.coordinates.longitude
              })
            };
            fetch('/api/climbing/gym', req)
              .then(res => res.json())
              .then(result => {
              });
          }
        });
    }
  }

  render() {
    const center = {
      lat: this.state.lat,
      lng: this.state.lng
    };

    return (
                polylineOptions: {
                  zIndex: 50,
                  strokeWeight: 5,
                  strokeOpacity: 1,
                  strokeColor: '#202020'
                }
              }}
              panel={document.getElementById('directions-panel')}
            />
    );
  }
}

Map.contextType = AppContext;
