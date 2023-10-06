import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';
import base_url from '../../components/config';

function ClaimBonusSitePage() {
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedBonusSite, setSelectedBonusSite] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');

  async function fetchBonusSites() {
    try {
      const response = await fetch(`${base_url}/bonus-sites/`, {
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

  const claimBonusSite = async () => {
    if (selectedBonusSite) {
      try {
        
        const userId = parseJwt(jwtToken);
        const requestData = {
          user_id: userId
        };   

        const response = await fetch(`${base_url}/bonus-sites/${selectedBonusSite.id}/claim/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Failed to claim bonus site');
        }

        console.log('Bonus site claimed successfully');
      } catch (error) {
        console.error('Error claiming bonus site:', selectedBonusSite.id, error);
      }
    } else {
      console.error('No bonus site selected to claim');
      alert("No Bonus Site selected to claim")
    }
  };

  return (
    <>
      <HeaderComponent />
      <div className='formBackground'>
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className='formTitle'>Claim a Bonus Site</label>
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
              <button className="mainButton" onClick={claimBonusSite}>CLAIM</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClaimBonusSitePage;

function parseJwt(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
