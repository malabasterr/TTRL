import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Dropdown from 'react-bootstrap/Dropdown';

function ClaimRoutePage() {
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

  // Function to handle bonus site selection
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

 // Function to claim the selected bonus site
 const claimRoute = async () => {
  if (selectedRoute) {
    try {

      const requestData = {
        team_id: "1446e8a4-350c-4aa1-a997-c05fb87ef102",
        user_id: "c682f244-9001-700c-084b-a077d902ad51", 
      };

      const response = await fetch(`/routes/${selectedRoute.id}/claim/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to route');
      }

      // Handle success, e.g., show a success message
      console.log('Route claimed successfully');
    } catch (error) {
      console.error('Error claiming route:', selectedRoute.id, error);
    }
  } else {
    console.error('No route selected to claim');
  }
};

  return (
    <><HeaderComponent />
    <div className='formBackground'>
      <div className="formContainer">
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Claim a Route</label>
        </div>

        <Dropdown>
            <Dropdown.Toggle variant="success" className="dropdown-basic">
              {selectedRoute ? selectedRoute.name : 'Select Route'}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
              {routes.map((route) => (
                <Dropdown.Item
                  key={route.id}
                  onClick={() => handleRouteSelect(route)}
                  className="dropdown-list"
                >
                  {route.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

        <div className="mainButtonContainer">
          <Link className="link-button" to="/Home"><button className="mainButton" onClick={claimRoute}>CLAIM</button></Link>
        </div>

      </div>
    </div></>
  );
}

export default ClaimRoutePage