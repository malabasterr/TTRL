import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import base_url from './config';

function MapComponent() {
  const [cityData, setCityData] = useState([]);
  const [connectionData, setConnectionData] = useState([]);
  const [map, setMap] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(7);

  const jwtToken = localStorage.getItem('jwtToken');

  const userNames = {
    '362202b4-f0a1-704f-58f7-13eabb4b64cf': 'Maddy',
    'd6022234-7081-70ff-e081-3bd53d1f5187': 'Jaz',
    '5642b254-1071-70d4-6b35-02af9eb01918': 'Hugh',
    '8692e234-a071-70a8-133f-a9ca6d7e20cb': 'Will H',
    'c682f244-9001-700c-084b-a077d902ad51': 'Will P',
    '86a25294-e0e1-70fd-db68-a0c4faf664a7': 'Michael',
  };

  useEffect(() => {
    const container = L.DomUtil.get('map');
    if (!container._leaflet_id) {
      const newMap = L.map('map').setView([48.505, 10.09], 4.4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);

      setMap(newMap);

      const fetchData = async () => {
        try {
          const cityResponse = await fetch(`${base_url}/cities/`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const cityData = await cityResponse.json();
          setCityData(cityData);

          const connectionResponse = await fetch(`${base_url}/routes/`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const connectionData = await connectionResponse.json();
          setConnectionData(connectionData);

          const bonusSitesResponse = await fetch(`${base_url}/bonus-sites/`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const bonusSitesData = await bonusSitesResponse.json();
          setCityData(bonusSitesData);

          cityData.forEach((city) => {
            const zoomLevel = newMap.getZoom();
            const iconSize = [(20 * zoomLevel) / 7, (20 * zoomLevel) / 7];

            const customMarkerIcon = L.divIcon({
              className: 'custom-marker-icon',
              iconSize: iconSize,
              html: '<div class="black-circle"></div>',
            });

            const marker = L.marker([city.latitude, city.longitude], {
              icon: customMarkerIcon,
            }).addTo(newMap);
            marker.bindPopup(city.name);
          });


          bonusSitesData.forEach((bonusSite) => {
            const zoomLevel = newMap.getZoom();
            const iconSize = [(20 * zoomLevel) / 7, (20 * zoomLevel) / 7];


            const bonusSitesMarkerIcon = L.divIcon({
              className: 'bonusSites-marker-icon',
              iconSize: iconSize,
              html: '<div class="black-circle"></div>',
            });

            const marker = L.marker([bonusSite.latitude, bonusSite.longitude], {
              icon: bonusSitesMarkerIcon,
            }).addTo(newMap);
            marker.bindPopup(bonusSite.site_name);
          });

          connectionData.forEach((connection) => {
            const sourceCity = cityData.find((city) => city.id === connection.start_city_id);
            const destinationCity = cityData.find((city) => city.id === connection.end_city_id);

            if (sourceCity && destinationCity) {
              const coordinates = [
                [sourceCity.latitude, sourceCity.longitude],
                [destinationCity.latitude, destinationCity.longitude],
              ];

              let routeColor = '#494949';

              if (connection.team_claims.length > 0) {
                const claimedTeamId = connection.team_claims[0].team_id;

                if (claimedTeamId === '79cd421b-81d4-4b00-8b59-da9e7560dc4b') {
                  routeColor = '#00ddff';
                } else if (claimedTeamId === '1446e8a4-350c-4aa1-a997-c05fb87ef102') {
                  routeColor = '#59a200';
                } else if (claimedTeamId === '0076f246-bf3c-4900-aadd-87b9a9a37452') {
                  routeColor = '#ff0000';
                }
              }

              const routeDistance = connection.distance;
              const routeName = connection.name;

              const polyline = L.polyline(coordinates, {
                color: routeColor,
                weight: 2,
                popupContent: `${routeName} Distance: ${routeDistance} km`,
              }).addTo(newMap);

              polyline.bindPopup(polyline.options.popupContent);
            } else {
              console.warn('Source or destination city not found for connection:', connection);
            }
          });

          if (jwtToken) {
            const userLocationsResponse = await fetch(`${base_url}/user-locations/`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            const userLocationsData = await userLocationsResponse.json();

            const activeLocations = userLocationsData.filter((location) => location.is_active);

            activeLocations.forEach((activeLocation) => {
              const zoomLevel = newMap.getZoom();
              const iconSize = [(20 * zoomLevel) / 7, (20 * zoomLevel) / 7];
  

              const userMarkerIcon = L.divIcon({
                className: 'user-marker-icon',
                iconSize: iconSize,
                html: '<div class="blue-circle"></div>',
              });

              const userMarker = L.marker([activeLocation.latitude, activeLocation.longitude], {
                icon: userMarkerIcon,
              }).addTo(newMap);
              const userName = userNames[activeLocation.user_id];
              userMarker.bindPopup(userName);
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 60000);

      newMap.on('zoomstart', () => {
        setCurrentZoom(newMap.getZoom());
      });

      newMap.on('zoomend', () => {
        fetchData();
      });

      return () => clearInterval(intervalId);
    }
  }, [jwtToken, loggedInUserId]);

  return <div id="map" style={{ height: '35vh' }}></div>;
}

export default MapComponent;
