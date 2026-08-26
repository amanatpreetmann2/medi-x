import React from 'react';

export default function MedixLogo({ 
  darkTheme = null, 
  size = 'medium', 
  showText = true, 
  className = "",
  onClick = null,
  title = undefined
}) {
  const sizeMap = {
    small: 32,
    medium: 42,
    large: 54
  };

  const fontMap = {
    small: '1.15rem',
    medium: '1.45rem',
    large: '1.8rem'
  };

  const pixelSize = typeof size === 'number' ? size : (sizeMap[size] || 42);
  const fontSize = typeof size === 'number' ? `${pixelSize * 0.55}px` : (fontMap[size] || '1.45rem');

  const isExplicitDark = darkTheme === true;
  const isExplicitLight = darkTheme === false;

  const fillClass = isExplicitDark 
    ? 'medix-svg-fill-dark' 
    : isExplicitLight 
      ? 'medix-svg-fill-light' 
      : 'medix-svg-fill';

  const strokeClass = isExplicitDark 
    ? 'medix-svg-stroke-dark' 
    : isExplicitLight 
      ? 'medix-svg-stroke-light' 
      : 'medix-svg-stroke';

  const textClass = isExplicitDark 
    ? 'medix-brand-title-dark' 
    : isExplicitLight 
      ? 'medix-brand-title-light' 
      : 'medix-brand-title';

  return (
    <div 
      className={`medix-brand-logo ${className}`}
      onClick={onClick}
      title={title}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.65rem', 
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'inherit'
      }}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Light Mode Gradient: Deep Navy to Teal */}
          <linearGradient id="medixGradLight" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#08305A" />
            <stop offset="50%" stopColor="#0D647C" />
            <stop offset="100%" stopColor="#148D85" />
          </linearGradient>

          {/* Dark Mode Gradient: Glowing Sky Cyan to Mint Teal */}
          <linearGradient id="medixGradDark" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>

        {/* Top-Right Circular Arc */}
        <path
          d="M 48 58 C 66 28 106 16 142 22 C 166 27 186 44 194 68"
          className={strokeClass}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Bottom Circular Arc */}
        <path
          d="M 44 140 C 62 172 102 186 138 181 C 162 176 182 160 190 138"
          className={strokeClass}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Digital Pixel Squares on Left */}
        <rect x="29" y="75" width="11" height="11" rx="2.5" className={fillClass} />
        <rect x="18" y="87" width="10" height="10" rx="2" className={fillClass} />
        <rect x="25" y="99" width="12" height="12" rx="3" className={fillClass} />
        <rect x="16" y="113" width="8" height="8" rx="1.5" className={fillClass} />
        <rect x="26" y="123" width="9" height="9" rx="2" className={fillClass} />
        <rect x="36" y="135" width="7" height="7" rx="1.5" className={fillClass} />

        {/* Rising Human Figure in Center */}
        <circle cx="106" cy="62" r="10" className={fillClass} />
        <path
          d="M 83 63 C 92 78 100 86 106 86 C 112 86 120 78 129 63 C 124 78 114 96 106 96 C 98 96 88 78 83 63 Z"
          className={fillClass}
        />

        {/* Main "M" Structure + "+" Cross */}
        <path
          d="M 52 64 C 52 64 68 59 70 70 L 70 152 C 70 162 56 162 56 162 L 56 78 C 56 78 78 126 106 137 C 134 126 156 78 156 78 L 156 110 L 136 110 C 133 110 133 124 136 124 L 156 124 L 156 152 C 156 162 170 162 170 152 L 170 124 L 190 124 C 193 124 193 110 190 110 L 170 110 L 170 70 C 170 59 154 64 154 64 L 106 120 L 52 64 Z"
          className={fillClass}
          fillRule="evenodd"
        />
      </svg>

      {showText && (
        <span 
          className={textClass} 
          style={{ fontSize, letterSpacing: '0.04em' }}
        >
          Medi<span className="medix-brand-x">-X</span>
        </span>
      )}
    </div>
  );
}
