// src/components/AuthCard.js
import React, { useState } from "react";
import "./Auth.css";

const AuthCard = ({
    mode,          // "login" | "signup"
    onLogin,
    onSignUp,
    onGuestLogin,
    onSwitchMode,
    loading,
    error,
    success, ...handlers
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isLogin = mode === "login";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin
                ? onLogin({ email, password })
                : console.log("Login:", { email, password });
        } else {
            onSignUp
                ? onSignUp({ name, email, password })
                : console.log("SignUp:", { name, email, password });
        }
    };

    const handleGuest = () => {
        if (onGuestLogin) onGuestLogin();
        else console.log("Login as guest");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <label className="auth-label">
                            Name
                            <input
                                type="text"
                                className="auth-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                    )}

                    <label className="auth-label">
                        Email address
                        <input
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Password
                        <input
                            type="password"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" className="auth-btn primary">
                        {isLogin ? "Log in" : "Sign up"}
                    </button>

                    {isLogin && (
                        <button
                            type="button"
                            className="auth-btn secondary"
                            onClick={handleGuest}
                        >
                            Log in as Guest
                        </button>
                    )}
                </form>

                <p className="auth-footer-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={onSwitchMode}
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>
                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}
            </div>
        </div>
    );
};

export default AuthCard;
