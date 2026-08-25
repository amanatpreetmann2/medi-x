import React from "react";

import {
  Calendar,
  CircleHelp,
  FileText,
  Grid2X2,
  Pill,
  Settings as SettingsIcon,
  Users,
  LogOut
} from "lucide-react";

function Sidebar({ page, setPage, user, onLogout }) {
  const userDisplay = user?.email || user?.name || "patient@medix.com";
  const initials = userDisplay ? userDisplay.substring(0, 2).toUpperCase() : "MX";

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Grid2X2 size={19} />
    },
    {
      name: "Appointments",
      icon: <Calendar size={19} />
    },
    {
      name: "Medications",
      icon: <Pill size={19} />
    },
    {
      name: "Doctors",
      icon: <Users size={19} />
    },
    {
      name: "Reports",
      icon: <FileText size={19} />
    }
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          +
        </div>
        <div>
          <strong>Medix Portal</strong>
          <small>Patient Access</small>
        </div>
      </div>

      {/* Dynamic Patient Info */}
      <div className="patient">
        <div className="patient-avatar">
          {initials}
        </div>
        <div className="patient-info" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <strong style={{ wordBreak: 'break-word', fontSize: '11px' }}>
            {userDisplay}
          </strong>
          <small>
            Patient ID: MX-9845
          </small>
        </div>
      </div>

      {/* Appointment Button */}
      <button
        className="book-appointment"
        onClick={() => setPage("Appointments")}
      >
        <Calendar size={17} />
        Book Appointment
      </button>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={
              page === item.name
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setPage(item.name)}
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

        <button
          className={
            page === "Support"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={() => setPage("Support")}
        >
          <CircleHelp size={19} />
          <span>Support</span>
        </button>

        {onLogout && (
          <button
            className="sidebar-item"
            style={{ color: '#dc2626', marginTop: '0.5rem' }}
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