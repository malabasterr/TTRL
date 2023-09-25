import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';

function ClaimBonusSitePage() {
  return (
    <div className='formBackground'>
      <div className="formContainer" >
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Claim a Bonus Site</label>
        </div>
  
        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Bonus Site Name"
          />
        </div>

        <div className="mainButtonContainer">
        <Link className="link-button" to="/"><button className="mainButton">CLAIM</button></Link>
        </div>

      </div>
    </div>
  )
}

export default ClaimBonusSitePage