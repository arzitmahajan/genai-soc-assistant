import api from "../api/axios";

const fetchStats = async (userId)=>{
    const resp  = await api.get(`/insights/get_insights?user_id=${userId}`);
    return resp.data;
}

const resetDashboard =  async (userId) => {
        const res = await api.post(`/insights/reset_dashboard?user_id=${userId}`);
        return res.data;
    }

export default {fetchStats,resetDashboard};