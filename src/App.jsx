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
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ email: "patient@medix.com", name: "Patient User" });
  const [page, setPage] = useState("Dashboard");
  const [toast, setToast] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (userData) => {
    setLoggedIn(true);
    if (userData) setUser(userData);
    setPage("Dashboard");
    showToast(`Welcome back, ${userData?.email || 'Patient'}! HIPAA session secured.`, 'success');
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
            setPage={setPage}
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
            onUpdateUser={(newUserData) => {
              setUser({ ...user, ...newUserData });
              showToast("Profile information updated successfully", "success");
            }}
          />
        );

      case "Support":
        return <Support />;

      default:
        return <Dashboard setPage={setPage} showToast={showToast} onOpenBookAppointment={() => setIsBookModalOpen(true)} />;
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
        setPage={setPage}
        user={user}
        onLogout={() => {
          setLoggedIn(false);
          showToast("Signed out safely", "info");
        }}
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