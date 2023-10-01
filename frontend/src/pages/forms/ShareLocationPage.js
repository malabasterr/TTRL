import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Dropdown from 'react-bootstrap/Dropdown';

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

        <Dropdown>
            <Dropdown.Toggle variant="success" className="dropdown-basic">
              {selectedTeam ? selectedTeam.name : 'Select Team'}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
              {teams.map((team) => (
                <Dropdown.Item
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className="dropdown-list"
                >
                  {team.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

        <div className="mainButtonContainer">
          <Link className="link-button" to="/Home"><button className="mainButton">SHARE</button></Link>
        </div>

      </div>
    </div></>
  )
}

export default ShareLocationPage