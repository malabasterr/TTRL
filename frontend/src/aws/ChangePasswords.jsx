import React, { useState } from "react";
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from "amazon-cognito-identity-js";
import "./styles/Login.scss";

function ChangePassword() {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_USERPOOL_ID,
    ClientId: process.env.REACT_APP_APPCLIENT_ID,
  });

  const handleChangePassword = () => {
    const userData = {
      Username: "USERNAME", // Replace with the user's username
      Pool: userPool, // Initialize userPool as you did in your other components
    };

    const cognitoUser = new CognitoUser(userData);

    // Confirm the new password
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        console.log('Password confirmed!');
        // Handle success, e.g., redirect to login page
      },
      onFailure(err) {
        console.log('Password not confirmed: ', err);
        // Handle failure, e.g., display an error message
      },
    });
  };

  return (
    <div>
      <label htmlFor="code">Code: </label>
      <input
        id="code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <label htmlFor="new_password">New Password: </label>
      <input
        id="new_password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
}

export default ChangePassword;
