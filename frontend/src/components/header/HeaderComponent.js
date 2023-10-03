import React from 'react';
import '../header/HeaderComponent.css';
import Logo from '../images/Logo.png';

function HeaderComponent({ logout }) {
  return (
    <header className="backgroundHD">
      <div className="containerHD">
        <a href="/Home">
          <img src={Logo} alt="Brand Logo" className="logo" />
        </a>
        <nav className="navbarRight">
          <a href="/Home" className="navButton">HOME</a>
          <button className="specialnavButton" onClick={logout}>
          LOGOUT
        </button>
        </nav>
      </div>
    </header>
  );
}

export default HeaderComponent;
