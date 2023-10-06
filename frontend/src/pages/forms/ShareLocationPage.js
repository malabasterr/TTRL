import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponentAll from '../../components/header/HeaderComponentAll';
import Select from 'react-select';
import base_url from '../../components/config';

function ShareLocationPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');

  async function fetchTeams() {
    try {
      const response = await fetch(`${base_url}/teams/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, [jwtToken]);

  const handleTeamSelect = (selectedOption) => {
    setSelectedTeam(selectedOption.value);
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

  const requestLocation = async () => {
    try {
      if (selectedTeam) {
        
        const requestData = {
          user_id: loggedInUserId,
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
        alert("Location tracked successfully");
      }
    } catch (error) {
      console.error('Error requesting location', error);
    }
  };

  return (
    <>
      <HeaderComponentAll />
      <div className='formBackground'>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Which team are you tracking?</label>
          </div>

          <Select
            className='dropdown-basic'
            options={teams.map((team) => ({
              value: team,
              label: team.name,
            }))}
            value={selectedTeam ? { value: selectedTeam, label: selectedTeam.name } : null}
            onChange={(selectedOption) => handleTeamSelect(selectedOption)}
            placeholder="Select Team"
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