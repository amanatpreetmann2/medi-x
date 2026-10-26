import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge"><KeyRound size={22} /></div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        {!isSubmitted ? (
          <>
            <h2 className="modal-title">Reset your password</h2>
            <p className="modal-desc">Enter your email to receive reset instructions.</p>
            <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} style={{ marginTop: '1rem' }}>
              <input type="email" required className="form-input" placeholder="name@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>Send Link</button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={36} color="#16877F" />
            <h3>Check your email</h3>
            <p>Sent to {resetEmail}</p>
            <button className="submit-btn" onClick={onClose}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}