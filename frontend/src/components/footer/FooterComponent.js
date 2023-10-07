import React from "react";
import "./FooterComponent.css";
import Logo from "../images/Logo.png";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <img src={Logo} alt="Brand Logo" className="logoFT" />
        <span className="textMuted">All Change: The Game 2023</span>
      </div>
    </footer>
  );
};

export default FooterComponent;
