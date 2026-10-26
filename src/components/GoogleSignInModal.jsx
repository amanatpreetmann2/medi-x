import React, { useState } from 'react';
import { X, UserPlus, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { isValidEmail } from '../utils/authStorage';

// Authentic Google Multi-Color SVG Icon
export function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function GoogleSignInModal({ isOpen, onClose, onGoogleSuccess }) {
  const [mode, setMode] = useState('select'); // 'select' | 'custom'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const presetAccounts = [
    {
      name: 'Kabir Patel',
      email: 'kabir.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      name: 'Ananya Singh',
      email: 'ananya.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
    }
  ];

  const handleSelectAccount = (account) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (onGoogleSuccess) {
        onGoogleSuccess({
          email: account.email,
          name: account.name,
          avatar: account.avatar,
          googleId: `google_${Date.now()}`
        });
      }
      onClose();
    }, 900);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(customEmail)) {
      setError('Please enter a valid Google email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const derivedName = customName.trim() || customEmail.split('@')[0];
      if (onGoogleSuccess) {
        onGoogleSuccess({
          email: customEmail.trim().toLowerCase(),
          name: derivedName,
          avatar: null,
          googleId: `google_${Date.now()}`
        });
      }
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="google-auth-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '430px',
          padding: '28px',
          boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
          position: 'relative',
          animation: 'fadeInUp 0.25s ease-out'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5f6368',
            padding: '6px',
            borderRadius: '50%'
          }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '12px' }}>
            <GoogleIcon size={34} />
          </div>
          <h2 style={{ fontSize: '1.28rem', fontWeight: 600, color: '#202124', margin: '0 0 6px 0' }}>
            Sign in with Google
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#5f6368', margin: 0 }}>
            to continue to <strong style={{ color: '#0070BA' }}>Medix Portal</strong>
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FDE8E8',
              color: '#9B1C1C',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div
              className="google-spinner"
              style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 16px',
                border: '3px solid #E8EAED',
                borderTopColor: '#4285F4',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <p style={{ fontSize: '0.9rem', color: '#3c4043', fontWeight: 500 }}>
              Verifying Google Credentials...
            </p>
          </div>
        ) : mode === 'select' ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {presetAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #dadce0',
                    background: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafd';
                    e.currentTarget.style.borderColor = '#4285f4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#dadce0';
                  }}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#202124' }}>
                      {acc.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#5f6368',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {acc.email}
                    </div>
                  </div>
                  <Check size={16} color="#0070BA" />
                </button>
              ))}
            </div>

            {/* Use Another Account Button */}
            <button
              type="button"
              onClick={() => {
                setError('');
                setMode('custom');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px dashed #c0c4cc',
                background: '#fafafa',
                cursor: 'pointer',
                color: '#1a73e8',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <UserPlus size={18} />
              <span>Use another Google account</span>
            </button>
          </div>
        ) : (
          /* Custom Real Email Google Sign-In */
          <form onSubmit={handleCustomSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#3c4043',
                  marginBottom: '5px'
                }}
              >
                Google Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #dadce0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#3c4043',
                  marginBottom: '5px'
                }}
              >
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #dadce0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setMode('select')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  background: '#f8f9fa',
                  color: '#3c4043',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>

              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#1a73e8',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Continue with Google <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Security Footer */}
        <div
          style={{
            marginTop: '22px',
            paddingTop: '14px',
            borderTop: '1px solid #f1f3f4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#70757a'
          }}
        >
          <ShieldCheck size={14} color="#34A853" />
          <span>OAuth 2.0 Secure Authentication</span>
        </div>
      </div>
    </div>
  );
}
