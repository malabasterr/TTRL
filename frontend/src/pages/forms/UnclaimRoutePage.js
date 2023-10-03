import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';

function UnclaimRoutePage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  async function fetchRoutes() {
    try {
      const response = await fetch('/routes/');
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
  }, []);

  const handleRouteSelect = (selectedOption) => {
    setSelectedRoute(selectedOption.value);
  };

 const claimRoute = async () => {
  if (selectedRoute) {
    try {
      const requestData = {
        team_id: "1446e8a4-350c-4aa1-a997-c05fb87ef102",
        user_id: "c682f244-9001-700c-084b-a077d902ad51", 
      };

      const response = await fetch(`/routes/${selectedRoute.id}/unclaim/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to route');
      }

      console.log('Route un-claimed successfully');
    } catch (error) {
      console.error('Error un-claiming route:', selectedRoute.id, error);
    }
  } else {
    console.error('No route selected to un-claim');
  }
};

  return (
    <><HeaderComponent />
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
          <Link className="link-button" to="/Home"><button className="mainButton" onClick={claimRoute}>UNCLAIM</button></Link>
        </div>

      </div>
    </div></>
  );
}

export default UnclaimRoutePage
