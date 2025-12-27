import React ,{useEffect}from "react";
import {useDispatch,useSelector} from "react-redux";
import { fetchDashboardStats } from "../store/slices/dashboardSlice";
const UploadedSummary = () => {
  const dispatch = useDispatch();
  const {uploads,reports,insights,lastUpload} = useSelector((state)=>state.dashboard);

  useEffect(()=>{
    dispatch(fetchDashboardStats());
  },[dispatch]);

  if("status"==="loading") return<p>Loading...</p>
  if("status"==="failed") return<p>Error fetching stats.</p>
  console.log("date = ",lastUpload);
  return (
    <div className="uploaded-summary card">
      <h3>Uploaded Reports Summary</h3>
      <div className="summary-row">
        <div>
          <p>Total Uploaded</p>
          <h2>{uploads}</h2>
        </div>
        <div>
          <p>Last Upload</p>
          <h2>{lastUpload||' Apr 27, 2024, 11:23 AM'}</h2>
        </div>
        <button className="status-btn" title="currently don't work">Processed</button>
      </div>
    </div>
  );
};

export default UploadedSummary;
