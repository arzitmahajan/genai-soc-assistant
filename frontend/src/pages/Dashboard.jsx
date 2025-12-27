import React from "react";

import "../styles/Dashboard.css";
import UploadedSummary from "../components/UploadSummary";
import Insight from "../components/Insight";
import DetailedReports from "../components/DetailedReports";
import ExportOptions from "../components/ExportOptions";
import { useDispatch, useSelector } from "react-redux";
import { resetDashboardData } from "../store/slices/dashboardSlice";
import { FiRotateCcw  } from "react-icons/fi";
import './Dashboard.css'
const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  console.log("USER ID:", user.id);  // 👈 console log here

  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetDashboardData());
  };
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>SOC Assistant</h1>

        <button
          className="refresh-icon-btn"
          onClick={handleReset}
          title="Reset dashboard"
        >
          <FiRotateCcw  size={18} />
        </button>
      </div>

      <UploadedSummary />
      <Insight />
      {/* <div className="reports-actions">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button className="btn">Upload New File</button>
          <button className="btn">Generate Report</button>
        </div>
      </div> */}
      <DetailedReports />
      {/* <ExportOptions /> */}
    </div>
  );
};

export default Dashboard;
