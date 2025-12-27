import React from "react";
import { useSelector } from "react-redux";
const DetailedReports = () => {
  const {detailedReports} = useSelector((state)=>state.dashboard);
  // const reports = [
  //   { id: 1, name: "Report Bam", date: "May 1, 2024", severity: "High/Low", category: "Malware" },
  //   { id: 2, name: "Report Bam", date: "May 1, 2024", severity: "Medium", category: "Phishing" },
  //   { id: 3, name: "Report Bam", date: "May 1, 2024", severity: "Low", category: "DDoS" },
  // ];

  return (
    <div className="detailed-reports card">
      <h3>Detailed Reports</h3>
      <table>
        <thead>
          <tr>
            <th>Report</th>
            <th>Upload Date</th>
            <th>Severity Distribution</th>
            <th>Threat Categories</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {detailedReports.map((r,idx) => (
            <tr key={idx}>
              <td>{r.name}</td>
              <td>{r.date}</td>
              <td>{r.severity}</td>
              <td>{r.category}</td>
              <td><a href="/">View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedReports;
