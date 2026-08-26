import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import ToastNotification from "./components/ToastNotification";
import BookAppointmentModal from "./components/BookAppointmentModal";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Medications from "./pages/Medications";
import Doctors from "./pages/Doctors";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

function App() {
  // Clear any legacy localStorage keys if present
  if (typeof window !== "undefined" && localStorage.getItem("medix_loggedIn")) {
    localStorage.removeItem("medix_loggedIn");
    localStorage.removeItem("medix_user");
    localStorage.removeItem("medix_page");
  }

  const [loggedIn, setLoggedIn] = useState(() => {
    return sessionStorage.getItem("medix_loggedIn") === "true";
  });

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("medix_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    return { email: "patient@medix.com", name: "Patient User" };
  });

  const [page, setPage] = useState(() => {
    return sessionStorage.getItem("medix_page") || "Dashboard";
  });

  const [toast, setToast] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const navigateToPage = (newPage) => {
    setPage(newPage);
    sessionStorage.setItem("medix_page", newPage);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (userData) => {
    setLoggedIn(true);
    sessionStorage.setItem("medix_loggedIn", "true");
    if (userData) {
      setUser(userData);
      sessionStorage.setItem("medix_user", JSON.stringify(userData));
    }
    navigateToPage("Dashboard");
    showToast(`Welcome back, ${userData?.email || 'Patient'}! HIPAA session secured.`, 'success');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem("medix_loggedIn");
    sessionStorage.removeItem("medix_user");
    sessionStorage.removeItem("medix_page");
    showToast("Signed out safely", "info");
  };

  const handleUpdateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    sessionStorage.setItem("medix_user", JSON.stringify(updated));
    showToast("Profile information updated successfully", "success");
  };

  const handleAppointmentConfirmed = (booking) => {
    showToast(`Appointment confirmed with ${booking.doctor} on ${booking.date} at ${booking.time}`, 'success');
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            setPage={navigateToPage}
            showToast={showToast}
            onOpenBookAppointment={() => setIsBookModalOpen(true)}
          />
        );

      case "Appointments":
        return <Appointments />;

      case "Medications":
        return <Medications />;

      case "Doctors":
        return <Doctors />;

      case "Reports":
        return <Reports />;

      case "Settings":
        return (
          <Settings
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case "Support":
        return <Support />;

      default:
        return (
          <Dashboard
            setPage={navigateToPage}
            showToast={showToast}
            onOpenBookAppointment={() => setIsBookModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="app">
      {/* Real-time Toast Alerts */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Interactive Appointment Scheduler Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={handleAppointmentConfirmed}
      />

      <Sidebar
        page={page}
        setPage={navigateToPage}
        user={user}
        onLogout={handleLogout}
        onOpenBookAppointment={() => setIsBookModalOpen(true)}
      />

      <div className="main-area">
        <Topbar user={user} />

        <div className="page-container">
          {renderPage()}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;