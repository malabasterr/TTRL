import React, { useState, useEffect } from 'react';
import ShareLocationPage from '../pages/forms/ShareLocationPage';
import MapComponent from './MapComponent';

function LocationTrackingComponent() {
  const [showUserLocations, setShowUserLocations] = useState(false);

  const toggleShowUserLocations = () => {
    setShowUserLocations((prevShowUserLocations) => !prevShowUserLocations);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUserLocations(false);
    }, 30 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [showUserLocations]);

  return (
    <div>
      <ShareLocationPage toggleShowUserLocations={toggleShowUserLocations} />
      <MapComponent showUserLocations={showUserLocations} />
    </div>
  );
}

export default LocationTrackingComponent;
