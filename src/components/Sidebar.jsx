import React from "react";

import {
  Calendar,
  CircleHelp,
  FileText,
  Grid2X2,
  Pill,
  Settings as SettingsIcon,
  Users
} from "lucide-react";

function Sidebar({ page, setPage }) {

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


      {/* Patient */}

      <div className="patient">

        <div className="patient-avatar">
          SJ
        </div>

        <div className="patient-info">

          <strong>Sarah Jenkins</strong>

          <small>
            Patient ID: 9845-2A
          </small>

        </div>

      </div>


      {/* Appointment Button */}

      <button
        className="book-appointment"
        onClick={() =>
          setPage("Appointments")
        }
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
            onClick={() =>
              setPage(item.name)
            }
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
          onClick={() =>
            setPage("Settings")
          }
        >

          <SettingsIcon size={50} />

          Settings

        </button>


        <button
          className={
            page === "Support"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={() =>
            setPage("Support")
          }
        >

          <CircleHelp size={19} />

          Support

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;