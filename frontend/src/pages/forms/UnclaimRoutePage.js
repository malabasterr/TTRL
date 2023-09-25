import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';

function UnclaimRoutePage() {
  return (
    <div className='formBackground'>
      <div className="formContainer" >
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Un-claim a Route</label>
        </div>
  
        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Route Name"
          />
        </div>

        <div className="mainButtonContainer">
        <Link className="link-button" to="/"><button className="mainButton">UNCLAIM</button></Link>
        </div>

      </div>
    </div>
  )
}

export default UnclaimRoutePage