import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.message) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#10B981" />,
    error: <AlertCircle size={20} color="#EF4444" />,
    info: <Info size={20} color="#38BDF8" />
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        background: 'var(--color-white)',
        color: 'var(--text)',
        border: '1.5px solid var(--border)',
        borderRadius: '14px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        minWidth: '280px',
        maxWidth: '380px',
        animation: 'cardFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {icons[toast.type] || icons.success}
      </div>

      <div style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
        {toast.message}
      </div>

      <button
        onClick={onClose}
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
