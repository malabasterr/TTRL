import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css'; // Import your custom CSS file

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: [],
      connectionData: [],
    };
  }

  componentDidMount() {
    const container = L.DomUtil.get('map');
    if (!container._leaflet_id) {
      const map = L.map('map').setView([48.505, 13.09], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      fetch('/cities/')
        .then((response) => response.json())
        .then((cityData) => {
          this.setState({ cityData });

          fetch('/routes/')
            .then((response) => response.json())
            .then((connectionData) => {
              this.setState({ connectionData });

              cityData.forEach((city) => {
                // Create a custom marker icon for cities
                const customMarkerIcon = L.divIcon({
                  className: 'custom-marker-icon',
                  iconSize: [25, 25], // Adjust the size as needed
                  html: '<div class="black-circle"></div>', // HTML content (black circle)
                });

                // Add the custom marker with the city's name as a popup
                const marker = L.marker([city.latitude, city.longitude], {
                  icon: customMarkerIcon, // Use the custom marker icon
                }).addTo(map);
                marker.bindPopup(city.name);
              });

              connectionData.forEach((connection) => {
                const sourceCity = this.state.cityData.find((city) => city.id === connection.start_city_id);
                const destinationCity = this.state.cityData.find((city) => city.id === connection.end_city_id);

                if (sourceCity && destinationCity) {
                  const coordinates = [
                    [sourceCity.latitude, sourceCity.longitude],
                    [destinationCity.latitude, destinationCity.longitude],
                  ];

                  let routeColor = '#7a7c7c';

                  if (connection.team_claims.length > 0) {
                    const claimedTeamId = connection.team_claims[0].team_id;

                    if (claimedTeamId === '79cd421b-81d4-4b00-8b59-da9e7560dc4b') {
                      routeColor = '#00cdcd';
                    } else if (claimedTeamId === '1446e8a4-350c-4aa1-a997-c05fb87ef102') {
                      routeColor = '#228900';
                    } else if (claimedTeamId === '0076f246-bf3c-4900-aadd-87b9a9a37452') {
                      routeColor = '#ff0000';
                    }
                  }

                  L.polyline(coordinates, { color: routeColor, weight: 2.5 }).addTo(map);
                } else {
                  console.warn('Source or destination city not found for connection:', connection);
                }
              });
            })
            .catch((error) => {
              console.error('Error fetching connection data:', error);
            });
        });
    }
  }

  render() {
    return <div id="map" style={{ height: '35vh' }}></div>;
  }
}

export default MapComponent;
