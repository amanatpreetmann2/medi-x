import React from "react";

function StatsCard({ title, value, icon, onClick, colorScheme = 'blue' }) {
  const colorStyles = {
    blue: { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
    green: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
    purple: { bg: '#F3E8FF', color: '#7C3AED', border: '#E9D5FF' },
    rose: { bg: '#FFE4E6', color: '#E11D48', border: '#FECDD3' },
  };

  const current = colorStyles[colorScheme] || colorStyles.blue;

  return (
    <div
      className="stats-card"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '18px 20px',
        borderRadius: '16px',
        background: 'var(--color-white)',
        border: '1.5px solid var(--border)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        className="stats-icon-box"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: current.bg,
          color: current.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${current.border}`,
          flexShrink: 0
        }}
      >
        {icon}
      </div>

      <div>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>{title}</p>
        <h2 style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>{value}</h2>
      </div>
    </div>
  );
}

export default StatsCard;