import React, { useState, useEffect } from "react";
import "./FormPages.css";
import { Link } from "react-router-dom";
import HeaderComponentAll from "../../components/header/HeaderComponentAll";
import Select from "react-select";
import base_url from "../../components/config";

function ClaimBonusSitePage() {
  const [bonusSites, setBonusSites] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedBonusSite, setSelectedBonusSite] = useState(null);
  const jwtToken = localStorage.getItem("jwtToken");

  async function fetchBonusSites() {
    try {
      const response = await fetch(`${base_url}/bonus-sites/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bonus sites data");
      }

      const data = await response.json();
      setBonusSites(data);
    } catch (error) {
      console.error("Error fetching bonus sites:", error);
    }
  }

  useEffect(() => {
    fetchBonusSites();
  }, [jwtToken]);

  const handleBonusSiteSelect = (selectedOption) => {
    setSelectedBonusSite(selectedOption.value);
  };

  async function fetchLoggedInUser() {
    try {
      const response = await fetch(`${base_url}/users/me/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logged in user data");
      }

      const data = await response.json();
      setLoggedInUserId(data.id);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, [jwtToken]);

  const claimBonusSite = async () => {
    if (selectedBonusSite) {
      try {
        const requestData = {
          user_id: loggedInUserId,
        };

        const response = await fetch(
          `${base_url}/bonus-sites/${selectedBonusSite.id}/claim/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(requestData),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to claim bonus site");
        }

        console.log("Bonus site claimed successfully");
        alert("Bonus Site claimed successfully");
      } catch (error) {
        console.error(
          "Error claiming bonus site:",
          selectedBonusSite.id,
          error,
        );
      }
    } else {
      console.error("No bonus site selected to claim");
      alert("No Bonus Site selected to claim");
    }
  };

  return (
    <>
      <HeaderComponentAll />
      <div className="formBackground">
        <div className="formContainer">
          <div className="claimRouteTitleContainer">
            <label className="formTitle">Claim a Bonus Site</label>
          </div>

          <Select
            className="dropdown-basic"
            options={bonusSites.map((bonusSite) => ({
              value: bonusSite,
              label: bonusSite.site_name,
            }))}
            value={
              selectedBonusSite
                ? {
                    value: selectedBonusSite,
                    label: selectedBonusSite.site_name,
                  }
                : null
            }
            onChange={(selectedOption) => handleBonusSiteSelect(selectedOption)}
            placeholder="Select Bonus Site"
            isSearchable={true}
          />

          <div className="mainButtonContainer">
            <Link className="link-button" to="/home">
              <button className="mainButton" onClick={claimBonusSite}>
                CLAIM
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClaimBonusSitePage;
