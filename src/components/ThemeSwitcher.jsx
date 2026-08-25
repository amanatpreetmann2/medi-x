import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export default function ThemeSwitcher({ currentTheme, onSelectTheme }) {
  const [activeTheme, setActiveTheme] = useState(currentTheme || 'classic');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'classic', name: 'Blue & Beige', primary: '#1B4965', accent: '#D8C4B6' },
    { id: 'emerald', name: 'Emerald Health', primary: '#059669', accent: '#10B981' },
    { id: 'royal', name: 'Royal Sapphire', primary: '#2563EB', accent: '#06B6D4' },
    { id: 'midnight', name: 'Midnight Dark', primary: '#38BDF8', accent: '#2DD4BF' },
    { id: 'amethyst', name: 'Amethyst Violet', primary: '#7C3AED', accent: '#EC4899' },
  ];

  const handleApplyTheme = (themeId) => {
    setActiveTheme(themeId);
    document.documentElement.className = `theme-${themeId}`;
    if (onSelectTheme) onSelectTheme(themeId);
  };

  useEffect(() => {
    document.documentElement.className = `theme-${activeTheme}`;
  }, [activeTheme]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        title="Live Interactive Color Theme Preview"
      >
        <Palette size={16} color="var(--blue)" />
        <span>Theme Preview</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--color-white)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '0.85rem',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            width: '230px',
            zIndex: 9999,
            animation: 'cardFadeIn 0.2s ease-out'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            Live Color Themes
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  handleApplyTheme(t.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: activeTheme === t.id ? '1.5px solid var(--blue)' : '1px solid transparent',
                  background: activeTheme === t.id ? 'var(--light-blue)' : 'transparent',
                  color: 'var(--text)',
                  fontSize: '0.8125rem',
                  fontWeight: activeTheme === t.id ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: t.primary }} />
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: t.accent }} />
                  </div>
                  <span>{t.name}</span>
                </div>
                {activeTheme === t.id && <Check size={14} color="var(--blue)" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
