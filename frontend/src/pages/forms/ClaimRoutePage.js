import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponentAll from '../../components/header/HeaderComponentAll';
import Select from 'react-select';
import base_url from '../../components/config';

function ClaimRoutePage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');

  async function fetchRoutes() {
    try {
      const response = await fetch(`${base_url}/routes/unclaimed/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes data');
      }

      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }

  useEffect(() => {
    fetchRoutes();
  }, [jwtToken]);

  const handleRouteSelect = (selectedOption) => {
    setSelectedRoute(selectedOption.value);
  };

  async function fetchLoggedInUser() {
    try {
      const response = await fetch(`${base_url}/users/me/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logged in user data');
      }

      const data = await response.json();
      setLoggedInUserId(data.id);
    } catch (error) {
      console.error('Error fetching logged in user data:', error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, [jwtToken]);

  const claimRoute = async () => {
    if (selectedRoute) {
      try {

        const requestData = {
          user_id: loggedInUserId,
        };  

        const response = await fetch(`${base_url}/routes/${selectedRoute.id}/claim/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to claim route');
        }

        console.log('Route claimed successfully');
        alert("Route claimed successfully")
      } catch (error) {
        console.error('Error claiming route:', selectedRoute.id, error);
      }
    } else {
      console.error('No route selected to claim');
      alert("No route selected to claim")
    }
  };

  return (
    <>
      <HeaderComponentAll />
      <div className='formBackground'>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Claim a Route</label>
          </div>

          <Select
            className='dropdown-basic'
            options={routes.map((route) => ({
              value: route,
              label: route.name,
            }))}
            value={selectedRoute ? { value: selectedRoute, label: selectedRoute.name } : null}
            onChange={(selectedOption) => handleRouteSelect(selectedOption)}
            placeholder="Select Route"
            isSearchable={true}
          />

          <div className="mainButtonContainer">
            <Link className="link-button" to="/home">
              <button className="mainButton" onClick={claimRoute}>
                CLAIM
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClaimRoutePage;