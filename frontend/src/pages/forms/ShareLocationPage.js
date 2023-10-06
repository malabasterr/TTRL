import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';
import base_url from '../../components/config';

function ShareLocationPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
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

  const requestLocation = async () => {
    try {
      if (selectedTeam) {
        const loggedInUserId = parseJwt(jwtToken);

        const requestData = {
          user_id: loggedInUserId,
          request_team_id: selectedTeam.id,
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

function parseJwt(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
