import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';
import base_url from '../../components/config';

function ShareLocationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption.value);
  };

  async function fetchUserLocation() {
    try {
      if (!selectedUser) {
        return;
      }
  
      const requestData = {
        user_id: selectedUser.value.id,
      };
  
      const response = await fetch(`${base_url}/user-locations/${requestData.user_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user location');
      }
  
      const data = await response.json();
      console.log('User location fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  }
  

  useEffect(() => {
    fetchUserLocation();
  }, [jwtToken]);

  const requestLocation = async () => {
      try {
        const userId = parseJwt(jwtToken);
        const requestData = {
          user_id: userId
        };   

        const response = await fetch(`${base_url}/user-locations/request/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to request location');
        }

        console.log('location requested successfully');
      } catch (error) {
        console.error('Error requesting location', error);
      }
  };

  return (
    <>
      <HeaderComponent />
      <div className='formBackground'>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Which user are you tracking?</label>
          </div>

          <Select
            className='dropdown-basic'
            options={users.map((user) => ({
              value: user,
              label: user.given_name,
            }))}
            value={selectedUser ? { value: selectedUser, label: selectedUser.given_name } : null}
            onChange={(selectedOption) => handleUserSelect(selectedOption)}
            placeholder="Select User"
            isSearchable={true}
          />

          <div className="mainButtonContainer">
            <Link className="link-button" to="/home">
              <button className="mainButton" onClick={requestLocation}>TRACK</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareLocationPage;

function parseJwt(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
