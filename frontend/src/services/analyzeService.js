// src/services/analyzeService.js
import api from "../api/axios";

// Start analysis for a file by filename
const analyzeFile = async (filename,user_id,saveReport) => {
  const resp = await api.post(`/analyze?filename=${filename}&user_id=${user_id}&save_report=${saveReport}`);
  return resp.data; // { analysis: "..." }
};

export default { analyzeFile };
