import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, User, CheckCircle2 } from 'lucide-react';
import MedixLogo from './MedixLogo';
import GoogleSignInModal, { GoogleIcon } from './GoogleSignInModal';
import {
  getRememberedCredentials,
  saveRememberedCredentials,
  authenticateWithEmail,
  authenticateWithGoogle,
  isValidEmail
} from '../utils/authStorage';

export default function LoginForm({ onLoginSuccess, onOpenForgotPassword }) {
  // Read remembered credentials from localStorage on initial render
  const remembered = getRememberedCredentials();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(remembered.email || '');
  const [password, setPassword] = useState(remembered.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(remembered.rememberMe);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [hasRememberedCreds, setHasRememberedCreds] = useState(
    Boolean(remembered.email && remembered.password)
  );

  // If user edits email or password, clear the remembered badge
  const handleEmailChange = (val) => {
    setEmail(val);
    setErrorMessage('');
    if (hasRememberedCreds && val !== remembered.email) {
      setHasRememberedCreds(false);
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    setErrorMessage('');
    if (hasRememberedCreds && val !== remembered.password) {
      setHasRememberedCreds(false);
    }
  };

  const handleClearSavedCredentials = () => {
    setEmail('');
    setPassword('');
    setHasRememberedCreds(false);
    saveRememberedCredentials({ email: '', password: '', rememberMe: false });
    setRememberMe(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();

    // 1. Validate Email with real email regex
    if (!cleanEmail) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // 2. Validate Password
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // 3. Validate Sign Up specific fields
    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Authenticate and save user & rememberMe details in localStorage
      const user = authenticateWithEmail({
        email: cleanEmail,
        password,
        rememberMe,
        name: fullName.trim()
      });

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    }, 800);
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = (googleData) => {
    const user = authenticateWithGoogle(googleData);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  return (
    <div className="login-card">
      <div className="mobile-logo-header">
        <MedixLogo size="medium" />
      </div>

      <div className="login-card-header">
        <h1 className="login-card-title">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="login-card-subtitle">
          {isSignUp
            ? 'Join Medix to manage your healthcare records'
            : 'Sign in to access your Medix health portal'}
        </p>
      </div>

      {/* Remembered Credentials Alert Notice */}
      {!isSignUp && hasRememberedCreds && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            color: '#1E40AF',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#2563EB" />
            <span>Remembered credentials loaded</span>
          </div>
          <button
            type="button"
            onClick={handleClearSavedCredentials}
            style={{
              background: 'none',
              border: 'none',
              color: '#3B82F6',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="error-banner" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name for Sign Up */}
        {isSignUp && (
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <User size={18} />
              </span>
              <input
                id="name-input"
                type="text"
                required
                className="form-input"
                placeholder="Dr. / Mr. / Ms. Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrorMessage('');
                }}
              />
            </div>
          </div>
        )}

        {/* Real Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">
            Email address
          </label>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <Mail size={18} />
            </span>
            <input
              id="email-input"
              type="email"
              required
              className="form-input"
              placeholder="e.g. your.name@gmail.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password-input">Password</label>
          </div>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <Lock size={18} />
            </span>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              required
              className="form-input has-right-icon"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password for Sign Up */}
        {isSignUp && (
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
              />
            </div>
          </div>
        )}

        {/* Form Options: Remember me & Forgot password */}
        {!isSignUp && (
          <div className="form-options-row">
            <label className="checkbox-label" title="Saves your details in localStorage">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={onOpenForgotPassword}
            >
              Forgot password?
            </button>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="btn-spinner" />
          ) : (
            <>
              {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* 3 Demo Patient Accounts for College Evaluation */}
      {!isSignUp && (
        <div style={{ marginTop: '1.25rem', border: '1.5px solid #BFDBFE', borderRadius: '12px', background: '#F8FAFC', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={16} color="#0B4F8A" />
            <strong style={{ fontSize: '12px', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              College Evaluation: 3 Demo Patients
            </strong>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748B' }}>
            Common Password: <strong style={{ color: '#0F172A' }}>MedixPatient2026!</strong> (Click to auto-fill & login):
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('kabir.patel@medix.com');
                setPassword('MedixPatient2026!');
                setErrorMessage('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>1. Kabir Patel (MX-1001)</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Cardiology • Hypertension • Lisinopril</span>
              </div>
              <span style={{ fontSize: '11px', color: '#0B4F8A', fontWeight: 700 }}>Fill ➔</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('ananya.singh@medix.com');
                setPassword('MedixPatient2026!');
                setErrorMessage('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>2. Ananya Singh (MX-1002)</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Endocrinology • Diabetes • Metformin</span>
              </div>
              <span style={{ fontSize: '11px', color: '#0B4F8A', fontWeight: 700 }}>Fill ➔</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('rahul.mehta@medix.com');
                setPassword('MedixPatient2026!');
                setErrorMessage('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>3. Rahul Mehta (MX-1003)</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Sports Med • Post-ACL • Iron Therapy</span>
              </div>
              <span style={{ fontSize: '11px', color: '#0B4F8A', fontWeight: 700 }}>Fill ➔</span>
            </button>
          </div>
        </div>
      )}

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Working Sign in with Google Button */}
      <button
        type="button"
        className="google-btn"
        onClick={() => setIsGoogleModalOpen(true)}
      >
        <GoogleIcon size={20} />
        <span>Sign in with Google</span>
      </button>

      {/* Toggle between Sign In & Sign Up */}
      <div className="login-card-footer">
        {isSignUp ? (
          <>
            Already have an account?
            <button
              type="button"
              className="signup-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
              }}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don't have an account?
            <button
              type="button"
              className="signup-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
              }}
            >
              Create account
            </button>
          </>
        )}
      </div>

      {/* Google OAuth Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onGoogleSuccess={handleGoogleSuccess}
      />
    </div>
  );
}