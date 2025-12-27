// src/pages/SignUpPage.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthCard from "../AuthCard/AuthCard";
import { signup } from "../../store/slices/authSlice";

const SignUpPage = ({ onSwitchMode }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = (data) => {
    setSuccessMessage("");
    dispatch(signup(data))
      .unwrap()
      .then(() => {
        setSuccessMessage("Account created successfully ✅ You can now log in.");
        onSwitchMode();
      })
      .catch(() => {});
  };

  return (
    <AuthCard
      mode="signup"
      loading={status === "loading"}
      error={error}
      success={successMessage}
      onSignUp={handleSignUp}
      onSwitchMode={onSwitchMode}
    />
  );
};

export default SignUpPage;
