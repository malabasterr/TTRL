// Confirmation.jsx
import React, { useState } from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { useParams, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { email } = useParams();

  const handleConfirmation = () => {
    const poolData = {
      UserPoolId: 'eu-west-2_tCIJ3cao1', // Your user pool id here
      ClientId: '7k34uusaan17621r0tkud0ojt6', // Your client id here
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email, // Replace with the user's email
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        setErrorMessage(err.message || JSON.stringify(err));
        return;
      }

      console.log("Confirmation result: ", result);
      navigate("/"); // Redirect the user to the login page after successful confirmation
    });
  };

  return (
    <div>
      <h1>Confirmation</h1>
      <div>
        <label htmlFor="confirmationCode">Confirmation Code</label>
        <input
          type="text"
          id="confirmationCode"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button onClick={handleConfirmation}>Confirm</button>
    </div>
  );
};

export default Confirmation;
