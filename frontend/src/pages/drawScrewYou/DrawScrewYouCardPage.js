import React, { useState, useEffect } from 'react';
import './DrawScrewYouCardPage.css';
import { Link } from 'react-router-dom';
import HeaderComponentAll from '../../components/header/HeaderComponentAll';
import base_url from '../../components/config';

function DrawScrewYouCardPage() {
  const [showCard, setShowCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');

  async function fetchLoggedInUser() {
    try {
      const response = await fetch(`${base_url}/users/me/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logged in user data');
      }

      const data = await response.json();
      setLoggedInUserId(data.id);
    } catch (error) {
      console.error('Error fetching logged in user data:', error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, [jwtToken]);

  const drawScrewCard = async () => {
    try {
      setIsLoading(true);

      const requestData = {
        user_id: loggedInUserId,
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

      const cardResponse = await fetch(`${base_url}/screw-cards/${loggedInUserId}`, {
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
    
    const requestData = {
      user_id: loggedInUserId,
    }; 

    try {
      const response = await fetch(`${base_url}/screw-cards/draw-history/${loggedInUserId}`, {
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
    if (loggedInUserId !== null) {
      fetchDrawHistory();
    }
  }, [jwtToken, loggedInUserId]);

  return (
    <>
      <HeaderComponentAll />
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
