import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class MapComponent extends Component {
  componentDidMount() {
    const container = L.DomUtil.get('map');
    if (!container._leaflet_id) {
      const map = L.map('map').setView([48.505, 13.09], 4.5); // Set initial coordinates and zoom level
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      fetch('YOUR_CITY_API_URL') // Ask Will to create an endpoint of all cities
        .then((response) => response.json())
        .then((cityData) => {
          this.setState({ cityData });

          fetch('http://localhost:3000/routes/')
            .then((response) => response.json())
            .then((connectionData) => {
              this.setState({ connectionData });

              cityData.forEach((city) => {
                const marker = L.marker([city.latitude, city.longitude]).addTo(map);
                marker.bindPopup(city.name); // Display city name when the marker is clicked
              });

              connectionData.forEach((connection) => {
                const sourceCity = this.state.cityData.find((city) => city.id === connection.sourceCityId);
                const destinationCity = this.state.cityData.find((city) => city.id === connection.destinationCityId);

                if (sourceCity && destinationCity) {
                  const coordinates = [
                    [sourceCity.latitude, sourceCity.longitude],
                    [destinationCity.latitude, destinationCity.longitude],
                  ];

                  // Draw the polyline on the map with specified style
                  L.polyline(coordinates, { color: 'blue', weight: 2 }).addTo(this.map);
                }
              });
            })
            .catch((error) => {
              console.error('Error fetching connection data:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching city data:', error);
        });
    }
  }
  
  render() {
    return <div id="map" style={{ height: '500px' }}></div>;
  }
}

export default MapComponent;
