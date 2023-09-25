import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';

function ShareLocationPage() {
  return (
    <div className='formBackground'>
      <div className="formContainer" >
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Share Location with...</label>
        </div>
  
        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Team Name"
          />
        </div>

        <div className="mainButtonContainer">
        <Link className="link-button" to="/"><button className="mainButton">SHARE</button></Link>
        </div>

      </div>
    </div>
  )
}

export default ShareLocationPage