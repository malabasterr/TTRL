import React, { useEffect, useState } from 'react';
import base_url from '../config';
import './Summaries.css'
import { Link } from 'react-router-dom';
import HeaderComponentAll from '../header/HeaderComponentAll';

function MWDistanceSummary() {
    const [routes, setRoutes] = useState([]);
    const [bonusSites, setBonusSites] = useState([]);
    const jwtToken = localStorage.getItem('jwtToken');
  
    async function fetchRoutesSummary() {
      try {
        const response = await fetch(`${base_url}/teams/0076f246-bf3c-4900-aadd-87b9a9a37452/routes/`, { //banana
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch routes data');
          }
    
          const data = await response.json();
          setRoutes(data);
        } catch (error) {
          console.error('Error fetching routes:', error);
        }
      }
  
      async function fetchBonusSitesSummary() {
          try {
            const response = await fetch(`${base_url}/teams/0076f246-bf3c-4900-aadd-87b9a9a37452/bonus-sites/`, { //banana
              headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch bonus sites data');
          }
    
          const data = await response.json();
          setBonusSites(data);
        } catch (error) {
          console.error('Error fetching bonus sites:', error);
        }
      }
  
    useEffect(() => {
        fetchRoutesSummary();
        fetchBonusSitesSummary();
    }, [jwtToken]);
  

    return (
        <><HeaderComponentAll /><div className='formBackgroundD'>
            <div className="formContainerD">
                <div className="claimRouteTitleContainer">
                    <label className='formTitleD'>Maddy and Will H</label>
                </div>

                <h2>Routes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Route Name</th>
                            <th>Value (km)</th>
                            <th>Time Claimed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route) => (
                            <tr key={route.id}>
                                <td>{route.name}</td>
                                <td>{route.distance}</td>
                                <td>{route.claim_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Bonus Sites</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Site Name</th>
                            <th>Value (km)</th>
                            <th>Time Claimed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonusSites.map((bonusSite) => (
                            <tr key={bonusSite.id}>
                                <td>{bonusSite.site_name}</td>
                                <td>{bonusSite.site_value}</td>
                                <td>{bonusSite.claim_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mainButtonContainerD">
                <Link className="link-button" to="/home">
                    <button className="mainButtonD">
                        CLOSE
                    </button>
                </Link>
            </div>
        </div></>
      );
    }
    
    export default MWDistanceSummary;