import React, { useState } from 'react';
import './DrawScrewYouCardPage.css';
import { Link } from 'react-router-dom';

function DrawScrewYouCardPage() {
  const CardList = [
    { title: 'Slow one team', description: 'A team of your choice must pause for 30 minutes, they must return to the same spot in 30 minutes time. If they are on a train this card applies from the moment they arrive at their destination station.' },
    { title: 'Slow both teams', description: 'All other teams must pause for 15 minutes, they must return to the same spot in 15 minutes time. If they are on a train this card applies from the moment they arrive at their destination station.' },
    { title: 'Delete a route', description: 'Delete one unclaimed route from the map, this cannot be a route that someone is travelling along' },
    { title: 'Reserve a route', description: 'Make one route only claimable by you, this lasts for 6 hours. Other teams are notified.' },
    { title: 'Eject', description: 'Make a team of your choice exit the train at the next station and they must let the train leave. If the team you choose is not on a train, then nothing happens.' },
    { title: 'Half reward', description: 'A team of your choice gets half value from their next completed challenge' },
    { title: 'Double veto', description: 'For all other teams the veto period is doubled for their next challenge.' },
    { title: 'Steal', description: 'Take €50 from the team of your choice. That team can go into negative balance.' },
  ];

  const getRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * CardList.length);
    return CardList[randomIndex];
  };

  const [showCard, setShowCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleDrawCard = () => {
    setSelectedCard(getRandomCard());
    setShowCard(true);
  };

  return (
    <div className='formBackgroundSY'>
      <div className="formContainerSY" >
        <div className="claimRouteTitleContainerSY">
          <label className='formTitleSY'>Draw a Screw You Card</label>
        </div>

        <div className="mainButtonContainerSY">
          {!showCard ? (
            <button className="mainButtonSY" onClick={handleDrawCard}>DRAW</button>
          ) : (
            <>
            <div className='card'>
              <div className='cardContainer'>
                <h2 className='cardTitle'>{selectedCard.title}</h2>
                <p className='cardDescription'>{selectedCard.description}</p>
              </div>
              </div>
              <Link className="link-buttonSY" to="/"><button className="mainButtonSY">HOME</button></Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrawScrewYouCardPage;
