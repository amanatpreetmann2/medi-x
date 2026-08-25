import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import MedixLogo from './MedixLogo';

export default function LoginForm({ onLoginSuccess, onOpenForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFillDemo = () => {
    setEmail('patient@medix.com');
    setPassword('MedixPatient2026!');
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          email: email,
          name: email.split('@')[0]
        });
      }
    }, 1200);
  };

  return (
    <div className="login-card">
      <div className="mobile-logo-header">
        <MedixLogo size="medium" />
      </div>

      <div className="login-card-header">
        <h1 className="login-card-title">Welcome back</h1>
        <p className="login-card-subtitle">Sign in to your Medix account</p>
      </div>

      {errorMessage && (
        <div className="error-banner" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Email address</label>
          <div className="input-wrapper">
            <span className="input-icon-left"><Mail size={18} /></span>
            <input
              id="email-input"
              type="email"
              required
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password-input">Password</label>
          </div>
          <div className="input-wrapper">
            <span className="input-icon-left"><Lock size={18} /></span>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              required
              className="form-input has-right-icon"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-options-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <button type="button" className="forgot-password-link" onClick={onOpenForgotPassword}>
            Forgot password?
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <span className="btn-spinner" /> : <>Sign In <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="demo-credentials-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={15} color="#2864A6" />
          <span>Demo patient: <strong>patient@medix.com</strong></span>
        </div>
        <button type="button" className="demo-fill-btn" onClick={handleFillDemo}>Auto-fill</button>
      </div>

      <div className="divider"><span>OR</span></div>

      <button type="button" className="google-btn" onClick={handleFillDemo}>
        Sign in with Google
      </button>

      <div className="login-card-footer">
        Don't have an account?
        <a href="#create" className="signup-link">Create account</a>
      </div>
    </div>
  );
}