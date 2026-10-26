import React from "react";

/**
 * Shared PageHeader component providing unified vertical spacing,
 * typography, section badges, and action button alignment across all patient portal pages.
 */
function PageHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  actions,
  children,
  className = ""
}) {
  return (
    <header className={`medix-page-header ${className}`}>
      <div className="medix-page-header-main">
        <div className="medix-page-header-text">
          {(badge || BadgeIcon) && (
            <div className="medix-page-badge">
              {BadgeIcon && <BadgeIcon size={15} className="medix-page-badge-icon" />}
              {badge && <span>{badge}</span>}
            </div>
          )}

          {title && <h1 className="medix-page-title">{title}</h1>}

          {subtitle && (
            <p className="medix-page-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="medix-page-header-actions">
            {actions}
          </div>
        )}
      </div>

      {children && (
        <div className="medix-page-header-bottom">
          {children}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
