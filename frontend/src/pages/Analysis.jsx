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

  const localFiles = useSelector((state) => state.upload.files); // session-only
  const cloudFiles = userUploadedFiles; // persisted
  const localFileNames = new Set(localFiles.map(f => f.name));

  const localReports = Object.keys(reports || {}).filter(
    (filename) => localFileNames.has(filename)
  );
  const cloudReports = savedReportFiles;

  const allFiles = [
    ...localFiles.map((f) => ({
      name: f.name,
      source: "local",
    })),
    ...cloudFiles.map((f) => ({
      name: f.filename,
      source: "cloud",
    })),
  ];


  const handleGenerate = () => {
    if (!selectedFile) return;

    const [source, filename] = selectedFile.split(":");

    // Avoid re-analysis
    if (reports[filename]) return;

    dispatch(
      analyzeFile({
        filename,
        user_id,
        saveReport: false, // 🚫 ALWAYS false from frontend
      })
    )
      .unwrap()
      .then((res) => {
        if (!res?.analysis) return;

        // 🔹 LOCAL FILE → LOCAL REPORT
        if (source === "local") {
          // store only in analyze slice (session)
          // already done by analyzeFile
          return;
        }

        // 🔹 CLOUD FILE → ASK TO SAVE
        if (source === "cloud") {
          const confirmSave = window.confirm("Save report to cloud?");
          if (confirmSave) {
            dispatch(
              saveReport({
                filename,
                user_id,
                analysis: res.analysis,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(fetchUserReports(user_id));
              });
          }
        }
      });
  };


  const handleViewReport = async (filename) => {
    try {
      const data = await reportService.getReportContent(user_id, filename);
      setReportContent(data.content);
    } catch (err) {
      console.error("Error loading report:", err);
    }

  };
  const handleViewLocalReport = (filename) => {
    const localAnalysis = reports[filename];
    if (!localAnalysis) return;

    setReportContent(localAnalysis);
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
                <option value="">Select a file</option>

                {allFiles.map((f) => (
                  <option
                    key={`${f.source}-${f.name}`}
                    value={`${f.source}:${f.name}`}
                  >
                    {f.name} ({f.source})
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
              {/* LOCAL REPORTS */}
              {localReports.map((filename) => (
                <li
                  className="report-row local clickable"
                  key={`local-${filename}`}
                  onClick={() => handleViewLocalReport(filename)}
                >
                  <div className="report-left">
                    <FiFileText size={30} color="#9ca3af" />
                    <div className="report-meta">
                      <div className="report-name">{filename}</div>
                      <span className="badge local">Session</span>
                    </div>
                  </div>

                  {/* spacer to align with Remove button */}
                  <div className="report-right-placeholder" />
                </li>
              ))}


              {/* CLOUD REPORTS */}
              {cloudReports.map((r) => (
                <li className="report-row" key={`cloud-${r.filename}`}>
                  <div
                    className="report-left"
                    onClick={() => handleViewReport(r.filename)}
                  >
                    <FiFileText size={30} color="#3b7f4c" />
                    <div className="report-meta">
                      <div className="report-name">{r.filename}</div>
                      <div className="report-time">
                        Generated {r.last_modified}
                      </div>
                      <span className="badge cloud">Saved</span>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch(deleteUserReport({ user_id, reportname: r.filename }))
                    }
                  >
                    <FiTrash2 size={16} />
                    Remove
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