import React, { useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = ({ accept = ".xlsx", onUpload }) => {
  const fileRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [uploadToCloud, setUploadToCloud] = useState(false);

  const handleChange = (e) => {
    setSelected(e.target.files[0]);
  };

  const handleUploadClick = () => {
    if (!selected) {
      alert("Please select a file");
      return;
    }
    onUpload?.({ file: selected, uploadToCloud });
  };

  return (
    <div className="upload-container">
      <h2 className="section-title">Upload File</h2>

      {/* File */}
      <div className="form-group">
        <label className="file-label">File</label>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="file-input"
        />
      </div>

      {/* Destination */}
      <div className="form-group">
        <label className="file-label">Upload Destination</label>

        <div className="upload-destination">
          <label className="radio-option">
            <input
              type="radio"
              name="destination"
              checked={!uploadToCloud}
              onChange={() => setUploadToCloud(false)}
            />
            Upload locally
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="destination"
              checked={uploadToCloud}
              onChange={() => setUploadToCloud(true)}
            />
            Upload to cloud
          </label>
        </div>
      </div>

      {/* Upload button */}
      <button className="upload-btn" onClick={handleUploadClick}>
        Upload
      </button>

      {/* Instructions */}
      <div className="instructions">
        <h3>Instructions</h3>
        <p>Upload an Excel (.xlsx) file with security data for analysis.</p>
      </div>
    </div>
  );
};

export default FileUploader;
