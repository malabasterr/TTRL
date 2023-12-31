import React, { useState, useEffect } from "react";
import "./FormPages.css";
import { Link } from "react-router-dom";
import HeaderComponentAll from "../../components/header/HeaderComponentAll";
import Select from "react-select";
import base_url from "../../components/config";

function UnclaimRoutePage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [bonusSites, setBonusSites] = useState([]);
  const [selectedBonusSite, setSelectedBonusSite] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserTeamId, setLoggedInUserTeamId] = useState(null);
  const jwtToken = localStorage.getItem("jwtToken");

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
      setLoggedInUserTeamId(data.team_id);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, [jwtToken]);

  async function fetchRoutes() {
    try {
      const requestData = {
        user_id: loggedInUserId,
        team_id: loggedInUserTeamId,
      };

      const routesResponse = await fetch(
        `${base_url}/teams/${loggedInUserTeamId}/routes/`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      if (!routesResponse.ok) {
        throw new Error("Failed to fetch routes data");
      }

      const routesData = await routesResponse.json();
      setRoutes(routesData);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }

  useEffect(() => {
    if (loggedInUserTeamId !== null) {
      fetchRoutes();
    }
  }, [jwtToken, loggedInUserTeamId]);

  const handleRouteSelect = (selectedOption) => {
    setSelectedRoute(selectedOption.value);
  };

  const unclaimRoute = async () => {
    if (selectedRoute) {
      try {
        const requestData = {
          user_id: loggedInUserId,
        };

        const response = await fetch(
          `${base_url}/routes/${selectedRoute.id}/unclaim/`,
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
          throw new Error("Failed to un-claim route");
        }

        console.log("Route un-claimed successfully");
        alert("Route un-claim successful");
      } catch (error) {
        console.error("Error un-claiming route:", selectedRoute.id, error);
      }
    } else {
      console.error("No route selected to un-claim");
      alert("No route selected to un-claim");
    }
  };

  async function fetchBonusSites() {
    try {
      const requestData = {
        user_id: loggedInUserId,
        team_id: loggedInUserTeamId,
      };

      const userResponse = await fetch(`${base_url}/users/${loggedInUserId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const response = await fetch(
        `${base_url}/teams/${loggedInUserTeamId}/bonus-sites/`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
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
    if (loggedInUserTeamId !== null) {
      fetchBonusSites();
    }
  }, [jwtToken, loggedInUserTeamId]);

  const handleBonusSiteSelect = (selectedOption) => {
    setSelectedBonusSite(selectedOption.value);
  };

  const unclaimBonusSite = async () => {
    if (selectedBonusSite) {
      try {
        const requestData = {
          user_id: loggedInUserId,
        };

        const response = await fetch(
          `${base_url}/bonus-sites/${selectedBonusSite.id}/unclaim/`,
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
          throw new Error("Failed to un-claim bonus site");
        }

        console.log("Bonus site un-claimed successfully");
        alert("Bonus Site un-claim successful");
      } catch (error) {
        console.error(
          "Error un-claiming bonus site:",
          selectedBonusSite.id,
          error,
        );
      }
    } else {
      console.error("No bonus site selected to un-claim");
      alert("No Bonus Site selected to un-claim");
    }
  };

  return (
    <>
      <HeaderComponentAll />
      <div className="formBackgroundUC">
        <div className="formContainerUC">
          <div className="claimRouteTitleContainerUC">
            <label className="formTitleUC">Un-claim a Route</label>
          </div>

          <Select
            className="dropdown-basicUC"
            options={routes.map((route) => ({
              value: route,
              label: route.name,
            }))}
            value={
              selectedRoute
                ? { value: selectedRoute, label: selectedRoute.name }
                : null
            }
            onChange={(selectedOption) => handleRouteSelect(selectedOption)}
            placeholder="Select Route"
            isSearchable={true}
          />

          <div className="mainButtonContainerUC">
            <Link className="link-buttonUC" to="/home">
              <button className="mainButtonUC" onClick={unclaimRoute}>
                UNCLAIM
              </button>
            </Link>
          </div>
        </div>
        <div className="formContainerUC">
          <div className="claimRouteTitleContainerUC">
            <label className="formTitleUC">Un-claim a Bonus Site</label>
          </div>

          <Select
            className="dropdown-basicUC"
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

          <div className="mainButtonContainerUC">
            <Link className="link-buttonUC" to="/home">
              <button className="mainButtonUC" onClick={unclaimBonusSite}>
                UNCLAIM
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnclaimRoutePage;
