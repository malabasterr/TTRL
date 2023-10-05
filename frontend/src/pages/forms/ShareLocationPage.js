import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';
import base_url from '../../components/config';
import MapComponent from '../../components/MapComponent';

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

  // async function fetchUserLocation() {
  //   console.log('test')
  //   try {
  //     if (!selectedUser) {
  //       console.error('Selected user is not defined');
  //       return;
  //     }

  //     const requestData = {
  //       user_id: selectedUser.id,
  //     };

  //     const response = await fetch(`${base_url}/user-locations/${requestData.user_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${jwtToken}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user location');
  //     }

  //     const data = await response.json();
  //     console.log('User location fetched successfully:', data);
  //   } catch (error) {
  //     console.error('Error fetching user location:', error);
  //   }
  // }

  // useEffect(() => {
  //   if (selectedUser) {
  //     fetchUserLocation();
  //   }
  // }, [selectedUser, jwtToken]);

  async function getTeamIdForLoggedInUser() {
    try {
      const loggedInUserId = parseJwt(jwtToken);
      // Fetch user data
      const response = await fetch(`${base_url}/users/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Find the logged-in user in the user data
      const loggedInUser = userData.find((user) => user.id === loggedInUserId);

      if (!loggedInUser) {
        console.error('Logged-in user not found in user data');
        return null;
      }

      // Extract and return the team ID
      const teamId = loggedInUser.team_id;
      return teamId;
    } catch (error) {
      console.error('Error fetching team ID:', error);
      return null;
    }
  }

  const requestLocation = async () => {
    try {
      if (selectedUser) {
        const loggedInUserId = parseJwt(jwtToken);
        const teamId = await getTeamIdForLoggedInUser();

        if (!teamId) {
          console.error('Failed to get team ID for logged-in user');
          return;
        }

        const requestData = {
          user_id: selectedUser.id,
          request_team_id: teamId,
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

        console.log('Location requested successfully');
      }
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
              label: user.given_name + ` ` + user.family_name,
            }))}
            value={selectedUser ? { value: selectedUser, label: selectedUser.given_name + ` ` + selectedUser.family_name } : null}
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
