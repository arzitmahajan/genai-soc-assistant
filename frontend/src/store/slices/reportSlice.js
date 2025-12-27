import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";

import reportService from "../../services/reportService";
export const saveReport = createAsyncThunk(
  "reports/saveReport",
  async ({ filename, user_id, analysis }, { rejectWithValue }) => {
    try {
      const response = await reportService.saveReport(filename, user_id, analysis);
      return response;
    }
    catch (err) {
      return rejectWithValue(err.message || "Save failed");
    }
  }
);

export const fetchUserReports = createAsyncThunk(
  "reports/fetchReports",
  async (user_id, { rejectWithValue }) => {
    try {
      const reports = await reportService.fetchUserReports(user_id);
      // console.log("OK ",reports);
      return reports;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const deleteUserReport = createAsyncThunk(
  "reports/deleteUserReport",
  async ({ user_id, reportname }, { rejectWithValue }) => {
    try {
      const data = await reportService.deleteReport(user_id, reportname);
      return reportname;
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to delete report");
    }
  }
)
const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    reportUrl: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetReportState: (state) => {
      state.status = "idle";
      state.error = null;
      state.reportUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save report
      .addCase(saveReport.pending, (state) => {
        state.status = "saving";
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        state.status = "saved";
        state.reportUrl = action.payload.report_url;
      })
      .addCase(saveReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch reports
      .addCase(fetchUserReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload;
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserReport.fulfilled, (state, action) => {
        if (Array.isArray(state.reports)) {
          state.reports = state.reports.filter(
            (f) => f.reportname !== action.payload
          );
        } else {
          state.reports = [];
        }
      })
  },
});
export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;