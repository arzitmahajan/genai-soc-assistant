import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const userId = state.auth.user?.id || "demo_user_123";
            const data = await dashboardService.fetchStats(userId);
            return data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.message || "Failed to fetch stats");
        }
    }
);

export const resetDashboardData = createAsyncThunk(
    "dashboard/reset",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const userId = state.auth.user?.id || "demo_user_123";
            const data = await dashboardService.resetDashboard(userId);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        uploads: 0,
        reports: 0,
        totalIncidents: 0,
        insights: [],
        incidentSummary: {},
        status: "idle",
        error: null,
        lastUpload: "",
        incidentTrends: [],
        detailedReports: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.uploads = action.payload.uploads;
                state.reports = action.payload.reports;
                state.totalIncidents = action.payload.totalIncidents;
                state.insights = action.payload.insights || [];
                state.incidentSummary = action.payload.incidentSummary;
                state.lastUpload = action.payload.lastUpload;
                state.incidentTrends = action.payload.incidentTrends || [];
                state.detailedReports = action.payload.detailedReports || [];
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(resetDashboardData.fulfilled, (state) => {
                return {
                    uploads: 0,
                    reports: 0,
                    totalIncidents: 0,
                    insights: [],
                    incidentSummary: {},
                    status: "idle",
                    error: null,
                    lastUpload: "",
                    incidentTrends: [],
                    detailedReports: [],
                };
            })
            ;
    },
})
export default dashboardSlice.reducer;
