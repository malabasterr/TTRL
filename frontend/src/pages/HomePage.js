import React from 'react'
import './HomePage.css';

function HomePage() {
  return (
    <>
      <div>HomePage</div>
      <div className='claimRouteButtonContainer'>
        <button className="claimRouteButton">CLAIM A ROUTE</button>
      </div>
      <div className='unclaimRouteButtonContainer'>
        <button className="unclaimRouteButton">UNCLAIM A ROUTE</button>
      </div>
      <div className='claimBonusSiteButtonContainer'>
        <button className="claimBonusSiteButton">CLAIM A BONUS SITE</button>
      </div>
      <div className='shareLocationButtonContainer'>
        <button className="shareLocationButton">SHARE LOCATION</button>
      </div>
      <div className='drawScrewYouCardButtonContainer'>
        <button className="drawScrewYouCardButton">DRAW SCREW YOU CARD</button>
      </div>
    </>
  )
}

export default HomePage