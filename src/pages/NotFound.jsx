import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '30px'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <AlertTriangle size={36} />
      </div>

      <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '0 0 10px 0', color: 'var(--text)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 14px 0', color: 'var(--text)' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '440px', color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
        The healthcare portal page you are looking for doesn't exist or has been moved. Check the URL or navigate back to the dashboard.
      </p>

      <div style={{ display: 'flex', gap: '14px' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1.5px solid var(--border)',
            background: 'var(--color-white)',
            color: 'var(--text)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '10px',
            background: 'var(--color-blue, #0284C7)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
