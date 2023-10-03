import React, { useState, useEffect } from 'react';
import './DrawScrewYouCardPage.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

function DrawScrewYouCardPage() {
  const [showCard, setShowCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const drawScrewCard = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/screw-cards/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: '1446e8a4-350c-4aa1-a997-c05fb87ef102', user_id: 'c682f244-9001-700c-084b-a077d902ad51' }),
      });

      if (!response.ok) {
        throw new Error('Failed to draw a screw card');
      }

      const data = await response.json();

      const cardResponse = await fetch(`/screw-cards/${data.id}`);

      if (!cardResponse.ok) {
        throw new Error('Failed to fetch screw card details');
      }

      const cardData = await cardResponse.json();

      setSelectedCard(cardData);
      setShowCard(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error drawing a screw card:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderComponent />
      <div className='formBackgroundSY'>
        <div className="formContainerSY">
          <div className="claimRouteTitleContainerSY">
            <label className='formTitleSY'>Draw a Screw You Card</label>
          </div>

          <div className="mainButtonContainerSY">
            {!showCard ? (
              isLoading ? (
                <p>Loading...</p>
              ) : (
                <button className="mainButtonSY" onClick={drawScrewCard}>DRAW</button>
              )
            ) : (
              <>
                <div className='card'>
                  <div className='cardContainer'>
                    <h2 className='cardTitle'>{selectedCard?.title}</h2>
                    <p className='cardDescription'>{selectedCard?.description}</p>
                  </div>
                </div>
                <Link className="link-buttonSY" to="/Home"><button className="mainButtonSY">HOME</button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DrawScrewYouCardPage;
