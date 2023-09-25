import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';

function ClaimRoutePage() {
  return (
    <div className='formBackground'>
      <div className="formContainer" >
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Claim a Route</label>
        </div>
  
        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Route Name"
          />
        </div>

        <div className="mainButtonContainer">
        <Link to="/"><button className="mainButton">CLAIM</button></Link>
        </div>

      </div>
    </div>
  );
}

export default ClaimRoutePage