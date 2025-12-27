import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeFile } from "../store/slices/analyzeSlice";
import { fetchUserFiles } from "../store/slices/fileSlice"
import { saveReport, fetchUserReports, deleteUserReport } from "../store/slices/reportSlice";
import reportService from '../services/reportService';
import './Analysis.css';
import { FiFileText, FiTrash2 } from "react-icons/fi";



export default function Analysis() {
  const dispatch = useDispatch();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportContent, setReportContent] = useState(null);

  const user_id = useSelector((state) => state.auth.user?.id);
  const { files } = useSelector((state) => state.upload); // from uploadSlice
  const { reports, status, error } = useSelector((state) => state.analyze);
  const { files: userUploadedFiles, status: userUploadedFileStatus, error: userUploadedFileError } = useSelector((state) => state.files);
  const { reports: userUploadedReports, status: userUploadedReportStatus, error: userUploadedReportError, reportUrl } = useSelector((state) => state.reports);

  const [selectedFile, setSelectedFile] = useState("");
  const savedReportFiles = userUploadedReports?.reports || [];
  const tempReportFiles = Object.keys(reports || {});



  const handleGenerate = () => {
    if (!selectedFile) return;
    // If already analyzed, don’t re-run
    if (!reports[selectedFile]) {
      dispatch(
        analyzeFile({
          filename: selectedFile,
          user_id: user_id,
          saveReport: false,
        })
      )
        .unwrap()
        .then((res) => {
          const confirmSave = window.confirm("Save report to cloud?");
          if (confirmSave) {
            if (!res?.analysis) {
              console.error("No analyses found in response:", res);
              return;
            }
            dispatch(
              saveReport({
                filename: selectedFile,
                user_id: user_id,
                analysis: res.analysis,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(fetchUserReports(user_id));
              });
          }
        });
      // console.log("Saving report with:", { selectedFile, user_id, analysis });

    }
  };

  const handleViewReport = async (filename) => {
    try {
      const data = await reportService.getReportContent(user_id, filename);
      setReportContent(data.content);
      console.log(data);
    } catch (err) {
      console.error("Error loading report:", err);
    }

  };

  // console.log("HI");
  // console.log("Selected file:", userUploadedReports);

  useEffect(() => {
    if (!user_id) return; // wait until auth is ready

    dispatch(fetchUserFiles(user_id));
    dispatch(fetchUserReports(user_id));
  }, [dispatch, user_id]);

  let analysisText = "";

  try {
    // Case 1: content is a JSON string
    if (typeof reportContent === "string") {
      const parsed = JSON.parse(reportContent);

      analysisText =
        parsed?.analysis?.analysis ||
        parsed?.analysis ||
        "";
    }

    // Case 2: content is already an object
    else if (typeof reportContent === "object" && reportContent !== null) {
      analysisText =
        reportContent?.analysis?.analysis ||
        reportContent?.analysis ||
        "";
    }
  } catch (err) {
    console.error("Failed to parse report content", err);
  }


  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="card">

          {/* HEADER */}
          <div className="analysis-top">
            <h2>Analysis</h2>

            <div className="analysis-actions">
              <span className="label">Select Report</span>

              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
              >
                <option value="">Select a report</option>
                {userUploadedFiles.map((f) => (
                  <option key={f.filename} value={f.filename}>
                    {f.filename}
                  </option>
                ))}
              </select>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={!selectedFile || status === "analyzing"}
              >
                Generate
              </button>
            </div>
          </div>

          {/* REPORTS */}
          <div className="reports-block">
            <h3>Reports</h3>

            <ul className="reports-list">
              {savedReportFiles.map((r) => (
                <li className="report-row" key={r.filename}>
                  <div
                    className="report-left"
                    onClick={() => handleViewReport(r.filename)}
                  >
                    {/* <span className="file-icon">📄</span> */}
                    <span className="icon-alignment">
                      <FiFileText size={30} color="#3b7f4c" />
                      <div className="report-meta">
                        <div className="report-name">{r.filename}</div>
                        <div className="report-time">
                          Generated {r.last_modified}
                        </div>
                      </div>
                    </span>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch(deleteUserReport({ user_id, reportname: r.filename }))
                    }
                  >
                    <span className="icon-alignment">
                      <FiTrash2 size={16} />
                      Remove
                    </span>

                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PREVIEW */}
          {/* 
          {
            reportContent && (
              <div className="preview-card">
                <div className="preview-header">
                  🔍 Analysis Result
                </div>

                <div className="preview-content">
                  {reportContent.analysis ? (
                    <p>{reportContent.analysis}</p>
                  ) : (
                    <pre>{JSON.stringify(reportContent, null, 2)}</pre>
                  )}
                  
                </div>
              </div>
            )
          } */}
          <h3>Reports Preview</h3>
          {analysisText && (
            <div className="preview-card">
              <div className="preview-header">
                <span>Analysis</span>
              </div>

              <div className="preview-content">
                <p className="analysis-text">
                  {analysisText}
                </p>
              </div>
            </div>
          )}


        </div>
      </div></div>
  );
}