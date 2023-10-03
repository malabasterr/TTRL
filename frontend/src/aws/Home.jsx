import {
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../pages/homepage/HomePage.css';
import MapComponent from '../components/MapComponent';
import { Link } from 'react-router-dom';
import HeaderComponent from "../components/header/HeaderComponent";

const userPool = new CognitoUserPool({
  UserPoolId: 'eu-west-2_tCIJ3cao1',
  ClientId: '7k34uusaan17621r0tkud0ojt6',
});

const WelcomeScreen = () => {

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const signOut = () => {

    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.signOut();
    }

    navigate("/");
  };

  const [teamOneDistances, setTeamOneDistances] = useState([]);
  const [teamTwoDistances, setTeamTwoDistances] = useState([]);
  const [teamThreeDistances, setTeamThreeDistances] = useState([]);
  
  async function fetchClaimedDistances(teamId, setDistances) {
    try {
      const response = await fetch(`/claimed-distance/${teamId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
  
      // Ensure that data is always an array (even if it's a single object)
      const dataArray = Array.isArray(data) ? data : [data];
  
      setDistances(dataArray);
    } catch (error) {
      console.error(`Error fetching team's distances:`, error);
    }
  }
  
  useEffect(() => {
    fetchClaimedDistances('1446e8a4-350c-4aa1-a997-c05fb87ef102', setTeamOneDistances);
    fetchClaimedDistances('79cd421b-81d4-4b00-8b59-da9e7560dc4b', setTeamTwoDistances);
    fetchClaimedDistances('0076f246-bf3c-4900-aadd-87b9a9a37452', setTeamThreeDistances);
  }, []);  

  
  return (
    <>
    <HeaderComponent logout={signOut}/>

    <div className='backgroundHP'>
        <div>
          <h1 className='title'>
            TICKET TO RIDE: LIVE
          </h1>
        </div>

        <div className='mapContainer'>
          <MapComponent />
        </div>

        <div className='totalDistancesContainer'>
          {teamOneDistances.map((teamDistance) => (
            <div key={teamDistance.team_id} className='teamOneDistanceContainer'>
              <h2 className='teamName'>{teamDistance.team_name}</h2>
              <h2 className='teamDistance'>{teamDistance.claimed_distance} km</h2>
            </div>
          ))}
          {teamTwoDistances.map((teamDistance) => (
            <div key={teamDistance.team_id} className='teamTwoDistanceContainer'>
              <h2 className='teamName'>{teamDistance.team_name}</h2>
              <h2 className='teamDistance'>{teamDistance.claimed_distance} km</h2>
            </div>
          ))}
          {teamThreeDistances.map((teamDistance) => (
            <div key={teamDistance.team_id} className='teamThreeDistanceContainer'>
              <h2 className='teamName'>{teamDistance.team_name}</h2>
              <h2 className='teamDistance'>{teamDistance.claimed_distance} km</h2>
            </div>
          ))}
        </div>

        <div className='topLineButtons'>
          <div className='claimRouteButtonContainer'>
            <Link to="/ClaimRoute"><button className="claimRouteButton">CLAIM A ROUTE</button></Link>
          </div>
          <div className='unclaimRouteButtonContainer'>
            <Link to="/UnclaimRoute"><button className="unclaimRouteButton">UNCLAIM A ROUTE</button></Link>
          </div>
        </div>
        <div className='bottomLineButtons'>
          <div className='claimBonusSiteButtonContainer'>
            <Link to="/ClaimBonusSite"><button className="claimBonusSiteButton">CLAIM A BONUS SITE</button></Link>
          </div>
          <div className='shareLocationButtonContainer'>
            <Link to="/ShareLocation"><button className="shareLocationButton">SHARE LOCATION</button></Link>
          </div>
          <div className='drawScrewYouCardButtonContainer'>
            <Link to="/DrawScrewYouCard"><button className="drawScrewYouCardButton">DRAW SCREW YOU CARD</button></Link>
          </div>
        </div>
        </div>
      </>
  );
};

export default WelcomeScreen;