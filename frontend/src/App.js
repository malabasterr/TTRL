import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
// import HeaderComponent from './components/header/HeaderComponent';
import FooterComponent from './components/footer/FooterComponent';
// import HomePage from './pages/homepage/HomePage';
import ClaimRoutePage from './pages/forms/ClaimRoutePage';
import UnclaimRoutePage from './pages/forms/UnclaimRoutePage';
import ClaimBonusSitePage from './pages/forms/ClaimBonusSitePage';
import ShareLocationPage from './pages/forms/ShareLocationPage';
import DrawScrewYouCardPage from './pages/drawScrewYou/DrawScrewYouCardPage';
import Error from './pages/Error';
import Login from './aws/Login';
// import SignUp from './aws/SignUp';
import Home from './aws/Home';
import store from './redux/store';
import { Provider } from "react-redux";
// import ChangePassword from './aws/ChangePasswords';
// import Confirmation from './aws/Confirmation';

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="appContainer">
        {/* <HeaderComponent /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/SignUp" element={<SignUp />} /> */}
          <Route path="/Home" element={<Home />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/ClaimRoute" element={<ClaimRoutePage />} />
          <Route path="/UnclaimRoute" element={<UnclaimRoutePage />} />
          <Route path="/ClaimBonusSite" element={<ClaimBonusSitePage />} />
          <Route path="/ShareLocation" element={<ShareLocationPage />} />
          <Route path="/DrawScrewYouCard" element={<DrawScrewYouCardPage />} />
          {/* <Route path= "/confirmation/:email" element={<Confirmation />} /> */}
          <Route path="*" element={<Error />} />
        </Routes>
        <FooterComponent />
      </div>
    </Router>
    </Provider>
  );
}

export default App;
