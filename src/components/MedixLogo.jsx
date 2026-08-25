import React from 'react';

export default function MedixLogo({ darkTheme = false, size = 'medium' }) {
  const iconSizes = {
    small: 28,
    medium: 36,
    large: 44
  };

  const fontSizes = {
    small: '1.25rem',
    medium: '1.5rem',
    large: '1.85rem'
  };

  const s = iconSizes[size] || iconSizes.medium;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none' }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect
          width="40"
          height="40"
          rx="10"
          fill={darkTheme ? 'url(#logoGradDark)' : 'url(#logoGradLight)'}
        />
        <path
          d="M20 10V30M10 20H30"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 20H16.5L18.5 14L21.5 26L23.5 18.5L25 20H28"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logoGradLight" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2864A6" />
            <stop offset="1" stopColor="#16877F" />
          </linearGradient>
          <linearGradient id="logoGradDark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: fontSizes[size] || fontSizes.medium,
          letterSpacing: '-0.03em',
          color: darkTheme ? '#FFFFFF' : '#123B5D',
          lineHeight: 1
        }}
      >
        Medix<span style={{ color: darkTheme ? '#2DD4BF' : '#16877F' }}>.</span>
      </span>
    </div>
  );
}
