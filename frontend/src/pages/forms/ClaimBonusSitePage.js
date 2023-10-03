import React, { useState, useEffect } from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import Select from 'react-select';

function ClaimBonusSitePage() {
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedBonusSite, setSelectedBonusSite] = useState(null);

  async function fetchBonusSites() {
    try {
      const response = await fetch('/bonus-sites/');
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
  }, []);

  const handleBonusSiteSelect = (selectedOption) => {
    setSelectedBonusSite(selectedOption.value);
  };

 const claimBonusSite = async () => {
  if (selectedBonusSite) {
    try {
      const requestData = {
        team_id: "1446e8a4-350c-4aa1-a997-c05fb87ef102",
        user_id: "c682f244-9001-700c-084b-a077d902ad51", 
      };

      const response = await fetch(`/bonus-sites/${selectedBonusSite.id}/claim/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            <Link className="link-button" to="/Home">
              <button className="mainButton" onClick={claimBonusSite}>CLAIM</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClaimBonusSitePage;
