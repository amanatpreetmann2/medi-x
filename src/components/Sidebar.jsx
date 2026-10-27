import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import MedixLogo from "./MedixLogo";
import { useAuth } from "../context/AuthContext";

import {
  Calendar,
  FileText,
  Grid2X2,
  Pill,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Mail,
  User,
  ShieldAlert,
  Layers
} from "lucide-react";

function Sidebar({ onOpenBookAppointment }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      to: "/dashboard",
      name: "Dashboard",
      icon: <Grid2X2 size={19} />
    },
    {
      to: "/appointments",
      name: "My Appointments",
      icon: <Calendar size={19} />
    },
    {
      to: "/reports",
      name: "My Health Records",
      icon: <FileText size={19} />
    },
    {
      to: "/medications",
      name: "My Medicines",
      icon: <Pill size={19} />
    },
    {
      to: "/notifications",
      name: "Notifications",
      icon: <Bell size={19} />
    },
    {
      to: "/email-notifications",
      name: "Email Notifications",
      icon: <Mail size={19} />
    },
    {
      to: "/profile",
      name: "My Profile",
      icon: <User size={19} />
    },
    {
      to: "/architecture",
      name: "Eval-2 Architecture",
      icon: <Layers size={19} />
    }
  ];

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo / Brand Link */}
      <Link 
        to="/dashboard"
        className="sidebar-brand"
        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
        title="Go to Dashboard"
      >
        <MedixLogo size={36} showText={false} />
        <div>
          <strong>Medix Portal</strong>
          <small>Patient Access</small>
        </div>
      </Link>

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

      {/* Appointment CTA Button */}
      <button
        className="book-appointment"
        onClick={() => {
          if (onOpenBookAppointment) {
            onOpenBookAppointment();
          } else {
            navigate("/appointments");
          }
        }}
      >
        <Calendar size={17} />
        Book Appointment
      </button>

      {/* Navigation Links using modern NavLink */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
            style={{ textDecoration: 'none' }}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
          style={{ textDecoration: 'none' }}
        >
          <SettingsIcon size={19} />
          <span>Settings</span>
        </NavLink>

        <button
          className="sidebar-item"
          style={{ color: '#dc2626', marginTop: '0.4rem', cursor: 'pointer' }}
          onClick={handleSignOut}
        >
          <LogOut size={19} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;