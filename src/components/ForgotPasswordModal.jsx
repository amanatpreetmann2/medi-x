import React, { useState } from 'react';
import { KeyRound, X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setResetEmail('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge">
            <KeyRound size={22} />
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {!isSubmitted ? (
          <>
            <h2 className="modal-title">Reset your password</h2>
            <p className="modal-desc">
              Enter your registered email address and we'll send you instructions to reset your account password.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <Mail size={18} />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="google-btn"
                  style={{ flex: 1 }}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !resetEmail}
                  className="submit-btn"
                  style={{ flex: 1.5, marginTop: 0 }}
                >
                  {isLoading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      Send Link <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: '#E6F5F4', borderRadius: '50%', color: '#16877F', marginBottom: '1rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 className="modal-title">Check your inbox</h3>
            <p className="modal-desc" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              We have sent password reset instructions to <strong>{resetEmail}</strong>.
            </p>
            <button className="submit-btn" onClick={handleClose}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
