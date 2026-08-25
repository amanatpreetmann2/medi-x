import React from "react";
import logo from "../assets/logo.jpeg";
import {
  Bell,
  Menu,
  Search,
  Settings
} from "lucide-react";

function Topbar() {

  return (
    <header className="topbar">

      <button className="mobile-menu">
        <Menu size={22} />
      </button>


      <div className="topbar-brand">
        <img src={logo} alt="Medi-X" />
      </div>

      <div className="topbar-text">
          <h1>Medi<span>-X</span></h1>
      </div>

      <div className="top-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search records, doctors..."
        />

      </div>


      <div className="topbar-right">

        <button className="topbar-icon">
          <Bell size={20} />
        </button>

        <button className="topbar-icon">
          <Settings size={20} />
        </button>

        <div className="top-avatar">
          SJ
        </div>

      </div>

    </header>
  );
}

export default Topbar;