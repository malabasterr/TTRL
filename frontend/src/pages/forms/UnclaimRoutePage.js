import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponentAll from '../../components/header/HeaderComponentAll';
import Select from 'react-select';
import base_url from '../../components/config';

function UnclaimRoutePage() {
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedBonusSite, setSelectedBonusSite] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');

  async function fetchUsers() {
    try {
      const response = await fetch(`${base_url}/users/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [jwtToken]);

  async function fetchRoutes() {
    try {
      // Get the user ID from the JWT token
      const userId = parseJwt(jwtToken);

      // Fetch the user's information
      const userResponse = await fetch(`${base_url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();

      // Extract the team ID from the user's information
      const teamId = userData.team_id;

      // Fetch routes based on the user's team ID
      const routesResponse = await fetch(`${base_url}/teams/${teamId}/routes/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!routesResponse.ok) {
        throw new Error('Failed to fetch routes data');
      }

      const routesData = await routesResponse.json();
      setRoutes(routesData);
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

  const unclaimRoute = async () => {
    if (selectedRoute) {
      try {
        
        const userId = parseJwt(jwtToken);
        const requestData = {
          user_id: userId
        };   

        const response = await fetch(`${base_url}/routes/${selectedRoute.id}/unclaim/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to un-claim route');
        }

        console.log('Route un-claimed successfully');
      } catch (error) {
        console.error('Error un-claiming route:', selectedRoute.id, error);
      }
    } else {
      console.error('No route selected to un-claim');
      alert("No route selected to un-claim")
    }
  };

  async function fetchBonusSites() {
    try {
      const userId = parseJwt(jwtToken);

      const userResponse = await fetch(`${base_url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();

      const teamId = userData.team_id;

      const response = await fetch(`${base_url}/teams/${teamId}/bonus-sites/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bonus sites data');
      }

      const data = await response.json();
      setBonusSites(data);
    } catch (error) {
      console.error('Error fetching bonus sites:', error);
    }
  }

  useEffect(() => {
    fetchBonusSites();
  }, [jwtToken]);

  const handleBonusSiteSelect = (selectedOption) => {
    setSelectedBonusSite(selectedOption.value);
  };

  const unclaimBonusSite = async () => {
    if (selectedBonusSite) {
      try {
        
        const userId = parseJwt(jwtToken);
        const requestData = {
          user_id: userId
        };   

        const response = await fetch(`${base_url}/bonus-sites/${selectedBonusSite.id}/unclaim/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to un-claim bonus site');
        }

        console.log('Bonus site un-claimed successfully');
      } catch (error) {
        console.error('Error un-claiming bonus site:', selectedBonusSite.id, error);
      }
    } else {
      console.error('No bonus site selected to un-claim');
      alert("No Bonus Site selected to un-claim")
    }
  };

  return (
    <>
      <HeaderComponentAll />
      <div className='formBackground'>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Un-claim a Route</label>
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
              <button className="mainButton" onClick={unclaimRoute}>UNCLAIM</button>
            </Link>
          </div>
        </div>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Un-claim a Bonus Site</label>
          </div>

          <Select
            className='dropdown-basic'
            options={bonusSites.map((bonusSite) => ({
              value: bonusSite,
              label: bonusSite.site_name,
            }))}
            value={selectedBonusSite ? { value: selectedBonusSite, label: selectedBonusSite.site_name } : null}
            onChange={(selectedOption) => handleBonusSiteSelect(selectedOption)}
            placeholder="Select Bonus Site"
            isSearchable={true}
          />

          <div className="mainButtonContainer">
            <Link className="link-button" to="/home">
              <button className="mainButton" onClick={unclaimBonusSite}>UNCLAIM</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnclaimRoutePage;

function parseJwt(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
