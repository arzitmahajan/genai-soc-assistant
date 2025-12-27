// src/store/slices/uploadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "../../services/uploadService";

// Async upload thunk with progress support
export const uploadFile = createAsyncThunk(
  "upload/uploadFile",
  async (file, thunkAPI) => {
    try {
      // THIS is how you access Redux state inside a thunk
      const state = thunkAPI.getState();
      const userId = state.auth.user?.id || "demo_user_123";

      const resp = await uploadService.uploadFile(file, userId);
      return { ...resp, name: file.name };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: err.message }
      );
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    files: [], // collection gallery
    reports:[],
    status: "idle", // idle | uploading | succeeded | failed
    progress: 0,
    error: null,
  },
  reducers: {
    addLocalFile: (state, action) => {
      // Add file to gallery (before upload)
      state.files.push({
        id: Date.now(),
        name: action.payload.name,
        file: action.payload.file,
        status: "pending",
      });
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((f) => f.id !== action.payload);
    },
    resetUploadState: (state) => {
      state.status = "idle";
      state.progress = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.status = "uploading";
        state.progress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.progress = 100;
        state.error = null;
        // Update last added file with result
        const idx = state.files.findIndex(
          (f) => f.name === action.payload.name
        );
        if (idx !== -1) {
          state.files[idx] = {
            ...state.files[idx],
            status: "uploaded",
            serverResponse: action.payload.file,
            name:action.payload.name
          };
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addLocalFile, removeFile, resetUploadState } =
  uploadSlice.actions;
export default uploadSlice.reducer;
