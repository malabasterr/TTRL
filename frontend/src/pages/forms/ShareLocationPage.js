import React from 'react';
import './FormPages.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

function ShareLocationPage() {
  return (
    <><HeaderComponent />
    <div className='formBackground'>
      <div className="formContainer">
        <div className="claimRouteTitleContainer">
          <label className='formTitle'>Which team are you tracking?</label>
        </div>

        <div className="formBoxContainer">
          <input
            className="formBox"
            placeholder="Team Name" />
        </div>

        <div className="mainButtonContainer">
          <Link className="link-button" to="/Home"><button className="mainButton">SHARE</button></Link>
        </div>

      </div>
    </div></>
  )
}

export default ShareLocationPage