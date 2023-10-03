import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';

function ShareLocationPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null); 

  async function fetchTeams() {
    try {
      const response = await fetch('/teams/');
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
  }, []);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
  };

  return (
    <><HeaderComponent />
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
          <Link className="link-button" to="/Home"><button className="mainButton">SHARE</button></Link>
        </div>

      </div>
    </div></>
  )
}

export default ShareLocationPage