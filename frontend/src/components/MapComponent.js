import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
                const marker = L.marker([city.latitude, city.longitude]).addTo(map);
                marker.bindPopup(city.name);
              });

              // Loop through each route in the connectionData
              connectionData.forEach((connection) => {
                // Find the source city in the cityData using the start_city_id from the route
                const sourceCity = this.state.cityData.find((city) => city.id === connection.start_city_id);

                // Find the destination city in the cityData using the end_city_id from the route
                const destinationCity = this.state.cityData.find((city) => city.id === connection.end_city_id);

                // Check if both source and destination cities are found
                if (sourceCity && destinationCity) {
                  // Create an array of coordinates for the polyline between source and destination
                  const coordinates = [
                    [sourceCity.latitude, sourceCity.longitude], // Source city coordinates
                    [destinationCity.latitude, destinationCity.longitude], // Destination city coordinates
                  ];

                  // Determine the color based on the route's claimed status
                  const routeColor = connection.team_claims.length > 0 ? 'green' : 'grey'; // Green for claimed, grey for unclaimed

                  // Draw the polyline on the map with specified style and color
                  L.polyline(coordinates, { color: routeColor, weight: 2 }).addTo(map);
                } else {
                  // Log a warning if either source or destination city is not found
                  console.warn('Source or destination city not found for connection:', connection);
                }
              });
            })
            .catch((error) => {
              // Handle any errors that occur during the fetch operation
              console.error('Error fetching connection data:', error);
            });
        })
    }
  }
  render() {
    return <div id="map" style={{ height: '35vh' }}></div>;
  }
}

export default MapComponent;
