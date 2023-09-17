import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
import HeaderComponent from './components/header/HeaderComponent';
import FooterComponent from './components/footer/FooterComponent';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClaimRoutePage from './pages/ClaimRoutePage';
import UnclaimRoutePage from './pages/UnclaimRoutePage';
import ClaimBonusSitePage from './pages/ClaimBonusSitePage';
import ShareLocationPage from './pages/ShareLocationPage';
import DrawScrewYouCardPage from './pages/DrawScrewYouCardPage';
import Error from './pages/Error';

function App() {
  return (
    <Router> {/* Wrap your entire app with the Router */}
      <div className="appContainer">
        <HeaderComponent />
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/ClaimRoute" element={<ClaimRoutePage />} />
          <Route path="/UnclaimRoute" element={<UnclaimRoutePage />} />
          <Route path="/ClaimBonusSite" element={<ClaimBonusSitePage />} />
          <Route path="/ShareLocation" element={<ShareLocationPage />} />
          <Route path="/DrawScrewYouCard" element={<DrawScrewYouCardPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;
