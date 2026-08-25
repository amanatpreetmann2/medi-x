import React, { useState } from "react";

import {
  CircleHelp,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail
} from "lucide-react";

function Login({ onLogin }) {

  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="login-page">

      <header className="login-header">

        <div className="medix-logo">

          <div className="logo-box">
            +
          </div>

          <span>Medix</span>

        </div>

        <div className="help-link">

          <CircleHelp size={18} />

          Help

        </div>

      </header>


      <main className="login-content">

        <div className="login-card">

          <div className="login-lock">

            <LockKeyhole size={29} />

          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Please sign in to access your portal
          </p>


          <label className="input-label">
            Email Address
          </label>

          <div className="login-input">

            <Mail size={18} />

            <input
              type="email"
              placeholder="you@example.com"
            />

          </div>


          <div className="password-label">

            <label className="input-label">
              Password
            </label>

            <a href="#">
              Forgot Password?
            </a>

          </div>


          <div className="login-input">

            <KeyRound size={18} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
            />

            <button
              className="eye-button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >

              {showPassword
                ? <EyeOff size={18} />
                : <Eye size={18} />
              }

            </button>

          </div>


          <label className="remember">

            <input type="checkbox" />

            Remember me

          </label>


          <button
            className="sign-in-button"
            onClick={onLogin}
          >
            Sign In
          </button>


          <div className="login-line"></div>


          <div className="signup-text">

            Don't have an account?

            <a href="#">
              Sign up
            </a>

          </div>

        </div>

      </main>


      <footer className="login-footer">

        <span>
          © 2026 Medix Health Portal
        </span>

        <div>

          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>

        </div>

      </footer>

    </div>
  );
}

export default Login;