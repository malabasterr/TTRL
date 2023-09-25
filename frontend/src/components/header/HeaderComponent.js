import React from 'react';
import '../header/HeaderComponent.css';
import Logo from '../images/Logo.png';

function HeaderComponent() {
  return (
    <header className="backgroundHD">
      <div className="containerHD">
            <a href="/">
              <img src={Logo} alt="Brand Logo" className="logo" />
            </a>
            <nav className="navbarRight">
              <a href="/" className="navButton">HOME</a>
              <a href="/ClaimRoute" className="specialnavButton">CLAIM ROUTE</a>
            </nav>
      </div>
    </header>
  );
}

export default HeaderComponent;
