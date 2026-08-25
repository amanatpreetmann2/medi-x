import React from 'react';

export default function FloatingCard({ icon: Icon, title, description, animationClass, iconColor = 'blue' }) {
  return (
    <div className={`floating-card ${animationClass}`}>
      <div className={`floating-card-icon-box ${iconColor}`}>
        {Icon && <Icon size={22} strokeWidth={2.2} />}
      </div>
      <div className="floating-card-content">
        <span className="floating-card-title">{title}</span>
        <span className="floating-card-desc">{description}</span>
      </div>
    </div>
  );
}
