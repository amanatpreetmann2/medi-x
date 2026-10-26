import React from "react";
import MedixLogo from "./MedixLogo";

import {
  Calendar,
  FileText,
  Grid2X2,
  Pill,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Mail,
  User
} from "lucide-react";

function Sidebar({ page, setPage, user, onLogout, onOpenBookAppointment }) {
  const userDisplayName = user?.name || (user?.email ? user.email.split('@')[0] : "Kabir Patel");
  const userEmail = user?.email || "patient@medix.com";
  const patientId = user?.patientId || user?.id || "MX-1001";

  const initials = (() => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "MX";
  })();

  const menuItems = [
    {
      id: "Dashboard",
      name: "Dashboard",
      icon: <Grid2X2 size={19} />
    },
    {
      id: "Appointments",
      name: "My Appointments",
      icon: <Calendar size={19} />
    },
    {
      id: "Reports",
      name: "My Health Records",
      icon: <FileText size={19} />
    },
    {
      id: "Medications",
      name: "My Medicines",
      icon: <Pill size={19} />
    },
    {
      id: "Notifications",
      name: "Notifications",
      icon: <Bell size={19} />
    },
    {
      id: "EmailNotifications",
      name: "Email Notifications",
      icon: <Mail size={19} />
    },
    {
      id: "Profile",
      name: "My Profile",
      icon: <User size={19} />
    }
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div 
        className="sidebar-brand"
        onClick={() => setPage && setPage("Dashboard")}
        style={{ cursor: "pointer" }}
        title="Go to Dashboard"
      >
        <MedixLogo size={36} showText={false} />
        <div>
          <strong>Medix Portal</strong>
          <small>Patient Access</small>
        </div>
      </div>

      {/* Dynamic Patient Info */}
      <div className="patient">
        <div className="patient-avatar" style={{ overflow: 'hidden' }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={userDisplayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            initials
          )}
        </div>
        <div className="patient-info" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <strong style={{ wordBreak: 'break-word', fontSize: '13px' }} title={userDisplayName}>
            {userDisplayName}
          </strong>
          <small
            title={userEmail}
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '140px'
            }}
          >
            {userEmail}
          </small>
          <small
            style={{
              color: 'var(--color-teal-accent, #00A896)',
              fontSize: '10px',
              marginTop: '2px',
              display: 'block',
              fontWeight: 700
            }}
          >
            ID: {patientId} {user?.provider === 'google' ? '• Google' : ''}
          </small>
        </div>
      </div>

      {/* Appointment Button */}
      <button
        className="book-appointment"
        onClick={() => {
          if (onOpenBookAppointment) {
            onOpenBookAppointment();
          } else {
            setPage("Appointments");
          }
        }}
      >
        <Calendar size={17} />
        Book Appointment
      </button>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={
              page === item.id
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setPage(item.id)}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button
          className={
            page === "Settings"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={() => setPage("Settings")}
        >
          <SettingsIcon size={19} />
          <span>Settings</span>
        </button>

        {onLogout && (
          <button
            className="sidebar-item"
            style={{ color: '#dc2626', marginTop: '0.4rem' }}
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        )}
      </div>

    </aside>
  );
}

export default Sidebar;