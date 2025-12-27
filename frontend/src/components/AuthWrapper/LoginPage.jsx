// src/pages/LoginPage.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthCard from "../AuthCard/AuthCard";
import { login, setGuestUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onSwitchMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (data) => {
    setSuccessMessage("");
    dispatch(login(data))
      .unwrap()
      .then(() => {
        setSuccessMessage("Logged in successfully ✅");
        navigate("/");
      })
      .catch(() => {});
  };

  const handleGuest = () => {
    setSuccessMessage("");
    dispatch(setGuestUser());
    setSuccessMessage("Continuing as guest ✅");
    navigate("/");
  };

  return (
    <>
      <AuthCard
        mode="login"
        loading={status === "loading"}
        error={error}
        success={successMessage}
        onLogin={handleLogin}
        onGuestLogin={handleGuest}
        onSwitchMode={onSwitchMode}
      />
    </>
  );
};

export default LoginPage;
