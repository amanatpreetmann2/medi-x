import React from "react";
import MedixLogo from "./MedixLogo";
import DarkModeToggle from "./DarkModeToggle";
import {
  Bell,
  Menu,
  Search,
  Settings
} from "lucide-react";

function Topbar({ user, setPage, onNavigateHome }) {
  const userDisplay = user?.email || user?.name || "User";
  const initials = userDisplay ? userDisplay.substring(0, 2).toUpperCase() : "MX";

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else if (setPage) {
      setPage("Dashboard");
    }
  };

  return (
    <header className="topbar">

      <button className="mobile-menu">
        <Menu size={22} />
      </button>

      <div 
        className="topbar-brand" 
        onClick={handleGoHome}
        style={{ cursor: "pointer" }}
        title="Go to Dashboard"
      >
        <MedixLogo size={44} showText={true} />
      </div>

      <div className="top-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search records, doctors..."
        />
      </div>

      <div className="topbar-right">
        {/* Dark / Light Theme Toggle Switch */}
        <DarkModeToggle />

        <button className="topbar-icon" title="Notifications">
          <Bell size={20} />
        </button>

        <button className="topbar-icon" title="Settings">
          <Settings size={20} />
        </button>

        <div className="top-avatar" title={userDisplay}>
          {initials}
        </div>
      </div>

    </header>
  );
}

export default Topbar;