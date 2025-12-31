import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFiles, deleteUserFile } from "../store/slices/fileSlice"
import FileUploader from '../components/FileUploader';
import { FiFileText } from "react-icons/fi";
import './UploadedFile.css';
// import { uploadFile, reset } from '../store/slices/uploadSlice';
import {
  addLocalFile,
  uploadFile,
  removeFile,
  resetUploadState,
} from "../store/slices/uploadSlice";
import { FiTrash2 } from "react-icons/fi";

export default function UploadPage() {
  const user_id = useSelector((state) => state.auth.user?.id);
  const dispatch = useDispatch();

  const { files, status, progress, error } = useSelector((s) => s.upload);
  const { files: userUploadedFiles, status: userUploadedFileStatus, error: userUploadedFileError } = useSelector((state) => state.files)
  const localFiles = files; // session-only
  const cloudFiles = userUploadedFiles; // persisted


  const handleSelect = ({ file, uploadToCloud }) => {
    if (uploadToCloud) {
      // Cloud upload ONLY
      dispatch(uploadFile(file))
        .unwrap()
        .then(() => {
          dispatch(fetchUserFiles(user_id));
        });
    } else {
      // Local session-only upload
      dispatch(addLocalFile({ name: file.name, file }));
    }
  };


  useEffect(() => {
    if (userUploadedFileStatus === "idle") {
      dispatch(fetchUserFiles(user_id));
    }
  }, [dispatch, userUploadedFileStatus]);

  return (
    <div className="page-wrapper">
      <div className="page-container">

        {/* Upload Card */}
        <div className="card">
          <FileUploader accept=".xlsx" onUpload={handleSelect} />

          {status === "uploading" && (
            <div className="upload-status">
              Uploading... {progress}%
            </div>
          )}

          {status === "failed" && (
            <div className="error">{error}</div>
          )}
        </div>

        {/* Uploaded Files Card */}
        <div className="card">
          <h2 className="section-title">Uploaded Files</h2>

          <ul className="uploaded-list">
            {/* Local (session-only) files */}
            {localFiles.map((f) => (
              <li className="uploaded-item local" key={`local-${f.name}`}>
                <div className="file-left">
                  <FiFileText size={22} color="#9ca3af" />
                  <span>{f.name}</span>
                  <span className="badge">Local</span>
                </div>
              </li>
            ))}

            {/* Cloud files */}
            {cloudFiles.map((f) => (
              <li className="uploaded-item" key={f.filename}>
                <div className="file-left">
                  <FiFileText size={22} color="#3b7f4c" />
                  <span>{f.filename}</span>
                  <span className="badge cloud">Cloud</span>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    dispatch(deleteUserFile({ user_id, filename: f.filename }))
                  }
                >
                  <FiTrash2 size={16} />
                  Remove
                </button>
              </li>
            ))}
          </ul>

        </div>

      </div>
    </div>
  );
}