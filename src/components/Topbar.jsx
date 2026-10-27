import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MedixLogo from "./MedixLogo";
import DarkModeToggle from "./DarkModeToggle";
import DemoSwitcher from "./DemoSwitcher";
import { useAuth } from "../context/AuthContext";
import { loadPatientAppointments } from "../store/slices/appointmentsSlice";
import { loadPatientMedications } from "../store/slices/medicationsSlice";
import { loadPatientReports } from "../store/slices/reportsSlice";
import {
  Bell,
  Menu,
  Search,
  Settings
} from "lucide-react";

function Topbar() {
  const { user, switchPatient } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const displayName = user?.name || user?.email || "User";
  const patientId = user?.patientId || user?.id || "MX-1001";
  
  // Calculate clean 2-letter initials
  const initials = (() => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "MX";
  })();

  const handlePatientSwitch = (patient) => {
    switchPatient(patient);
    // Sync Redux slices with selected patient
    dispatch(loadPatientAppointments(patient.id || patient.patientId));
    dispatch(loadPatientMedications(patient.id || patient.patientId));
    dispatch(loadPatientReports(patient.id || patient.patientId));
  };

  return (
    <header className="topbar">
      <button className="mobile-menu" aria-label="Toggle navigation">
        <Menu size={22} />
      </button>

      <div
        className="topbar-brand"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
        title="Medix Home"
      >
        <MedixLogo size={44} showText={true} />
      </div>

      <div className="top-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search records, medications, appointments..."
        />
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Convenient Demo Patient Switcher for Presentation */}
        <DemoSwitcher
          currentPatientId={patientId}
          onSwitchPatient={handlePatientSwitch}
        />

        {/* Dark / Light Theme Toggle Switch powered by ThemeContext */}
        <DarkModeToggle />

        <button
          className="topbar-icon"
          title="Notifications & Reminders"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={20} />
        </button>

        <button
          className="topbar-icon"
          title="Account Settings"
          onClick={() => navigate("/settings")}
        >
          <Settings size={20} />
        </button>

        <div
          className="top-avatar"
          title={`${displayName} (${user?.email || 'Logged In'})`}
          onClick={() => navigate("/profile")}
          style={{ cursor: 'pointer', overflow: 'hidden' }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            initials
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;