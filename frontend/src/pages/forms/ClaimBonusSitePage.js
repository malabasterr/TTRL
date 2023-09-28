import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

function ClaimBonusSitePage() {
  return (
    <><HeaderComponent />
    <div className='formBackground'>
      <div className="formContainer">
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Claim a Bonus Site</label>
        </div>

        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Bonus Site Name" />
        </div>

        <div className="mainButtonContainer">
          <Link className="link-button" to="/Home"><button className="mainButton">CLAIM</button></Link>
        </div>

      </div>
    </div></>
  )
}

export default ClaimBonusSitePage