import React from "react";
import "../header/HeaderComponentLogin.css";
import Logo from "../images/Logo.png";

function HeaderComponentLogin() {
  return (
    <header className="backgroundHDL">
      <div className="containerHDL">
        <a href="/">
          <img src={Logo} alt="Brand Logo" className="logoL" />
        </a>
      </div>
    </header>
  );
}

export default HeaderComponentLogin;
