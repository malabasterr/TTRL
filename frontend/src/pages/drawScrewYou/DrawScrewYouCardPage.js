import React, { useState, useEffect } from 'react';
import './DrawScrewYouCardPage.css';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';
import base_url from '../../components/config';

function DrawScrewYouCardPage() {
  const [showCard, setShowCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');

  const drawScrewCard = async () => {
    try {
      setIsLoading(true);

      const userId = parseJwt(jwtToken);
      const requestData = {
        user_id: userId
      };  

      const response = await fetch(`${base_url}/screw-cards/draw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to draw a screw card');
      }

      const data = await response.json();

      const cardResponse = await fetch(`${base_url}/screw-cards/${data.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

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

  async function fetchDrawHistory() {
    const userId = parseJwt(jwtToken);
    const requestData = {
      user_id: userId
    };  

    try {
      const response = await fetch(`${base_url}/screw-cards/draw-history/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch draw history');
      }

      const data = await response.json();
      setDrawHistory(data);
    } catch (error) {
      console.error('Error fetching draw history:', error);
    }
  }

  useEffect(() => {
    fetchDrawHistory();
  }, [jwtToken]);

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
                <Link className="link-buttonSY" to="/home"><button className="mainButtonSY">HOME</button></Link>
              </>
            )}
          </div>

          <div>
            <h2 className='drawHistoryTitle'>DRAW HISTORY:</h2>
            <div className="drawHistoryContainer">
              {drawHistory.map((card) => (
                <div className='cardContainerH' key={card.id}>
                  <h3 className='cardTitleH'>{card.title}</h3>
                  <p className='cardDescriptionH'>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default DrawScrewYouCardPage;

function parseJwt(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.sub;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
