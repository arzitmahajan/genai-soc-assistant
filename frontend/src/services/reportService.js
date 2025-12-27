import api from '../api/axios'
const saveReport = async(filename,user_id,analysis)=>{
  const cleanAnalysis = JSON.parse(JSON.stringify(analysis));

    const resp  = await api.post(
        `/reports/save_report?user_id=${user_id}&filename=${filename}`,
       {analysis:cleanAnalysis},
        {
            headers:{'Content-Type':'application/json'},
        }
    );
    return resp.data;
}
const fetchUserReports = async (user_id) => {
  const resp = await api.get(`/reports/list_reports?user_id=${user_id}`);
  return resp.data;
};

// Optional: delete a report later
const deleteReport = async (user_id, reportname) => {
  const resp = await api.delete(
    `/reports/delete_report?user_id=${user_id}&reportname=${reportname}`
  );
  return resp.data;
};

const getReportContent = async(user_id,filename)=>{
  const resp = await api.get(`/reports/get_report_content?user_id=${user_id}&filename=${filename}`);
  return resp.data;
}

export default { saveReport, fetchUserReports, deleteReport, getReportContent};