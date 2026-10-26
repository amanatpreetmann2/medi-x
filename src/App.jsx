import React, { useState } from "react";

// Storage & Authentication helper
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  saveRegisteredAccount
} from "./utils/authStorage";
import { getPatientById } from "./utils/hospitalStore";

// Layout Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Medications from "./pages/Medications";
import Doctors from "./pages/Doctors";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import EmailNotifications from "./pages/EmailNotifications";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

function App() {
  // Restore authenticated session from localStorage if available
  const initialAuth = getStoredAuth();
  const [loggedIn, setLoggedIn] = useState(initialAuth.isLoggedIn);
  const [user, setUser] = useState(
    initialAuth.user || getPatientById('MX-1001')
  );
  const [page, setPage] = useState("Dashboard");

  // Handle successful login (email, google, or demo)
  const handleLogin = (userData) => {
    // If logging in with demo patient email, match full patient profile
    const matchedPatient = getPatientById(userData.patientId) || userData;
    const finalUser = { ...matchedPatient, ...userData };
    setUser(finalUser);
    setLoggedIn(true);
    setPage("Dashboard");
    setStoredAuth(finalUser);
  };

  // Handle user logout
  const handleLogout = () => {
    clearStoredAuth();
    setLoggedIn(false);
    setUser(null);
  };

  // Handle switching patient from Topbar Demo Switcher or Admin
  const handleSwitchPatient = (patient) => {
    setUser(patient);
    setStoredAuth(patient);
  };

  // Handle user profile updates from Settings or Profile page
  const handleUpdateUser = (updatedFields) => {
    const updated = {
      ...(user || {}),
      ...updatedFields
    };
    setUser(updated);
    setStoredAuth(updated);
    saveRegisteredAccount(updated);
  };

  // ---------------------------------------------------------------------------
  // 1. If user is NOT logged in, show the split-screen Login page
  // ---------------------------------------------------------------------------
  if (!loggedIn) {
    return <Login onLogin={handleLogin} onLoginSuccess={handleLogin} />;
  }

  // ---------------------------------------------------------------------------
  // 2. Render authenticated patient portal pages based on active navigation tab
  // ---------------------------------------------------------------------------
  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return <Dashboard setPage={setPage} user={user} />;

      case "Appointments":
        return <Appointments user={user} />;

      case "Medications":
        return <Medications user={user} />;

      case "Reports":
        return <Reports user={user} />;

      case "Notifications":
        return <Notifications user={user} />;

      case "EmailNotifications":
        return <EmailNotifications user={user} />;

      case "Profile":
        return <Profile user={user} onUpdateUser={handleUpdateUser} />;

      case "Admin":
        return (
          <AdminPanel
            onSwitchPatient={(p) => {
              handleSwitchPatient(p);
              setPage("Dashboard");
            }}
          />
        );

      case "Doctors":
        return <Doctors user={user} />;

      case "Settings":
        return <Settings user={user} onUpdateUser={handleUpdateUser} />;

      case "Support":
        return <Support user={user} />;

      default:
        return <Dashboard setPage={setPage} user={user} />;
    }
  };

  // ---------------------------------------------------------------------------
  // 3. Authenticated Layout Structure
  // ---------------------------------------------------------------------------
  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />

      <div className="main-area">
        <Topbar
          user={user}
          setPage={setPage}
          onNavigateHome={() => setPage("Dashboard")}
          onSwitchPatient={handleSwitchPatient}
        />

        <div className="page-container">
          {renderPage()}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;