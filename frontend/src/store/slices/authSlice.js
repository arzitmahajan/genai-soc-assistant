// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const resp = await api.post("/auth/login", credentials, { withCredentials: true });
      console.log(resp.data);
      return resp.data.user; // { email }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const resp = await api.post("/auth/signup", credentials);
      return resp.data; // user
    }
    catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await api.get("/auth/me", { withCredentials: true });
      return resp.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logoutLocal(state) {
      state.user = null;
    },
    setGuestUser(state) {
      state.user = {
        id: "guest_0001",
        email: "guest@soc-assistant"
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.detail || action.payload?.message || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.detail || action.payload?.message || "Signup failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "idle";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { logoutLocal, setGuestUser } = authSlice.actions;
export default authSlice.reducer;
