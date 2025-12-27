import React, { useState } from "react";
import { useSelector } from "react-redux";
import IncidentTrendsChart from "./IncidentTrendsChart";


const Insight = () => {
  const { totalIncidents,insights, incidentSummary } = useSelector((state) => state.dashboard);
  const high = incidentSummary?.high || 0;
  const low = incidentSummary?.low || 0;
  const medium = incidentSummary?.medium || 0;
  const total = high + low + medium;
  console.log("high = ",high)
  if (!incidentSummary) return <p>Loading...</p>;

  return (
    <div className="insights card">
      <h3>Key Insights from Analysis</h3>
      <div className="insights-content">
        <div className="insight-1st-item">
          <h2>{totalIncidents} Incidents Detected</h2>
          <div className="severity-bar">
            <span
              className="high"
              style={{ flex: high }}
              title={`High: ${high}`}
            ></span>
            <span
              className="medium"
              style={{ flex: medium }}
              title={`Medium: ${medium}`}
            ></span>
            <span
              className="low"
              style={{ flex: low }}
              title={`Low: ${low}`}
            ></span>
          </div>
          <div>
            <span className="dot high"></span> High ({high}) |{" "}
            <span className="dot medium"></span> Medium ({medium}) |{" "}
            <span className="dot low"></span> Low ({low})
          </div>
          
        </div>
        <div className="insight-2nd-item">
          <h4>Top 5 Threats</h4>
          <ul>
            {insights.length > 0 ? (
              insights.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>No insights yet</li>
            )}
          </ul>
        </div>
        <div className="insight-3rd-item">
          {/* <img src="https://via.placeholder.com/150x100" alt="trend chart" /> */}
          <IncidentTrendsChart/>
        </div>
      </div>
    </div>
  );
};

export default Insight;
