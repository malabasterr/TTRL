import React, { useState, useEffect } from 'react';
import './HomePage.css';
import MapComponent from '../../components/MapComponent';
import { Link } from 'react-router-dom';

function HomePage() {
  const [claimedDistances, setClaimedDistances] = useState([]);

  async function fetchClaimedDistances() {
    try {
      const response = await fetch('/claimed-distance/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setClaimedDistances(data);

    } catch (error) {
      console.error('Error fetching distances:', error);
    }
  }

  useEffect(() => {
    fetchClaimedDistances();
  }, []);

  return (
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
        <div className='teamOneDistanceContainer'>
          <h2 className='teamName'>WILL + MIKE</h2>
          <h2 className='teamDistance'>1000km</h2>
          {/* {claimedDistances.map((teamDistance) => (
            <div key={teamDistance.team_id} className='teamOneDistanceContainer'>
            <h2 className='teamName'>{teamDistance.team_name}</h2>
            <h2 className='teamDistance'>{teamDistance.claimed_distance} km</h2>
          </div>
          ))} */}
        </div>
        <div className='teamTwoDistanceContainer'>
          <h2 className='teamName'>JAZ + HUGH</h2>
          <h2 className='teamDistance'>1000km</h2>
        </div>
        <div className='teamThreeDistanceContainer'>
          <h2 className='teamName'>MADDY + WILL</h2>
          <h2 className='teamDistance'>1000km</h2>
        </div>
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
  )
}

export default HomePage