import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  dashboard: 'Dashboard',
  appointments: 'My Appointments',
  reports: 'My Health Records',
  medications: 'My Medicines',
  doctors: 'Find Doctors',
  notifications: 'Notifications',
  'email-notifications': 'Email Alerts',
  profile: 'My Profile',
  settings: 'Settings',
  admin: 'Admin Panel',
  support: 'Support & Help',
  architecture: 'Evaluation 2 Architecture'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 24px 0 24px',
        fontSize: '13px',
        color: 'var(--muted)',
        fontWeight: 500
      }}
    >
      <Link
        to="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--muted)',
          textDecoration: 'none',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} style={{ opacity: 0.5 }} />
            {isLast ? (
              <span
                style={{
                  color: 'var(--text)',
                  fontWeight: 600
                }}
              >
                {label}
              </span>
            ) : (
              <Link
                to={to}
                style={{
                  color: 'var(--muted)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
