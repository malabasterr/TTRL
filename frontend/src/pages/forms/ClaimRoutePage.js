import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

function ClaimRoutePage() {
  return (
    <><HeaderComponent />
    <div className='formBackground'>
      <div className="formContainer">
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Claim a Route</label>
        </div>

        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Route Name" />
        </div>

        <div className="mainButtonContainer">
          <Link className="link-button" to="/Home"><button className="mainButton">CLAIM</button></Link>
        </div>

      </div>
    </div></>
  );
}

export default ClaimRoutePage