import React from 'react';
import '../header/HeaderComponent.css';
import Logo from '../images/Logo.png';

function HeaderComponentAll() {
  return (
    <header className="backgroundHD">
      <div className="containerHD">
        <a href="/home">
          <img src={Logo} alt="Brand Logo" className="logo" />
        </a>
        <nav className="navbarRight">
          <a href="/home" className="navButton">HOME</a>
        </nav>
      </div>
    </header>
  );
}

export default HeaderComponentAll;
