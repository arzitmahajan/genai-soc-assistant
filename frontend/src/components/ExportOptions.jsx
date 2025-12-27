import React from "react";

const ExportOptions = () => {
  return (
    <div className="export-options card">
      <h3>Export Options</h3>
      <button className="btn">Export as PDF</button>
      <button className="btn">Export as CSV/XLSX</button>
      <button className="btn">Share via Email</button>
    </div>
  );
};

export default ExportOptions;
