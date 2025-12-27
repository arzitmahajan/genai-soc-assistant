// src/store/slices/analyzeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import analyzeService from "../../services/analyzeService";

// Async thunk to analyze a file
export const analyzeFile = createAsyncThunk(
  "analyze/analyzeFile",
  async ({filename, user_id,saveReport},{ rejectWithValue }) => {
    try {
      const resp = await analyzeService.analyzeFile(filename,user_id,saveReport);
      console.log("Checking the work");
      console.log(resp);
      return { filename, analysis: resp.analysis };
    }
    catch (err) {
      return rejectWithValue(err.message || "Analysis failed");
    }
  }

);

const analyzeSlice = createSlice({
  name: "analyze",
  initialState: {
    reports: {}, // key = filename, value = analysis result
    status: "idle",
    error: null,
  },
  reducers: {
    resetAnalysis: (state) => {
      state.status = "idle";
      state.error = null;
      state.reports = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeFile.pending, (state) => {
        state.status = "analyzing";
        state.error = null;
      })
      .addCase(analyzeFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports[action.payload.filename] = action.payload.analysis;
      })
      .addCase(analyzeFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetAnalysis } = analyzeSlice.actions;
export default analyzeSlice.reducer;
