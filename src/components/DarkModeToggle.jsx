import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 0.85rem',
        borderRadius: '20px',
        border: '1.5px solid var(--border)',
        background: 'var(--color-white)',
        color: 'var(--text)',
        fontWeight: 600,
        fontSize: '0.8125rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark Theme Mode"
    >
      {isDark ? (
        <>
          <Sun size={16} color="#F59E0B" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={16} color="#0284C7" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
