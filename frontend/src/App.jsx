import { React, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UploadFile from "./pages/UploadFile";
import Analysis from "./pages/Analysis";
import LoginPage from "./components/AuthWrapper/LoginPage";
import SignUpPage from "./components/AuthWrapper/SignUpPage";
import PrivateRoute from "./utils/PrivateRoute";
import { useDispatch } from "react-redux";
import { fetchMe, setGuestUser } from "./store/slices/authSlice";
export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/auth")) return;
    
    dispatch(fetchMe())
      .unwrap()
      .catch(() => {
        dispatch(setGuestUser());
      });
  }, [dispatch]);


  return (
    <Routes>
      <Route path="/auth" element={<AuthWrapper />} />

      {/* PROTECTED AREA */}
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadFile />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Small wrapper for login/signup toggle
function AuthWrapper() {
  const [mode, setMode] = useState("login");
  return mode === "login" ? (
    <LoginPage onSwitchMode={() => setMode("signup")} />
  ) : (
    <SignUpPage onSwitchMode={() => setMode("login")} />
  );
}
