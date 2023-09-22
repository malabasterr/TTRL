import React from 'react'
import './HomePage.css';
import MapComponent from '../components/MapComponent';

function HomePage() {
  return (
    <>
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
          <h2 className='teamName'>Will and Mike</h2>
          <h2 className='teamDistance'>1000km</h2>
        </div>
        <div className='teamTwoDistanceContainer'>
          <h2 className='teamName'>Jaz and Hugh</h2>
          <h2 className='teamDistance'>1000km</h2>
        </div>
        <div className='teamThreeDistanceContainer'>
          <h2 className='teamName'>Maddy and Will</h2>
          <h2 className='teamDistance'>1000km</h2>
        </div>
      </div>
      <div className='topLineButtons'>
        <div className='claimRouteButtonContainer'>
          <button className="claimRouteButton">CLAIM A ROUTE</button>
        </div>
        <div className='unclaimRouteButtonContainer'>
          <button className="unclaimRouteButton">UNCLAIM A ROUTE</button>
        </div>
      </div>
      <div className='bottomLineButtons'>
        <div className='claimBonusSiteButtonContainer'>
          <button className="claimBonusSiteButton">CLAIM A BONUS SITE</button>
        </div>
        <div className='shareLocationButtonContainer'>
          <button className="shareLocationButton">SHARE LOCATION</button>
        </div>
        <div className='drawScrewYouCardButtonContainer'>
          <button className="drawScrewYouCardButton">DRAW SCREW YOU CARD</button>
        </div>
      </div>
    </>
  )
}

export default HomePage