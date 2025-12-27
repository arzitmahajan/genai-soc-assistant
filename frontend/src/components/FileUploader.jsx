import React, { useRef, useState } from 'react';


const FileUploader = ({ accept = '.xlsx', onUpload }) => {
    const fileRef = useRef(null);
    const [selected, setSelected] = useState(null);


    const handleChange = (e) => {
        const f = e.target.files[0];
        setSelected(f);
    };


    const handleUploadClick = () => {
        if (!selected) return alert('Please select a file');
        if (onUpload) onUpload(selected);
    };


    return (
        <div className="upload-container">
            <h2 className="section-title">Upload File</h2>

            <label className="file-label">File</label>
            <input
                ref={fileRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="file-input"
            />

            <button className="upload-btn" onClick={handleUploadClick}>
                Upload
            </button>

            <div className="instructions">
                <h3>Instructions</h3>
                <p>Upload an Excel (xlsx) file with security data for analysis.</p>
            </div>
        </div>
    );

};


export default FileUploader;