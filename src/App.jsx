import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

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
  const [page, setPage] = useState("Dashboard");

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setLoggedIn(true);
          setPage("Dashboard");
        }}
      />
    );
  }

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return <Dashboard setPage={setPage} />;

      case "Appointments":
        return <Appointments />;

      case "Medications":
        return <Medications />;

      case "Doctors":
        return <Doctors />;

      case "Reports":
        return <Reports />;

      case "Settings":
        return <Settings />;

      case "Support":
        return <Support />;

      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div className="app">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <div className="main-area">

        <Topbar />

        <div className="page-container">
          {renderPage()}
        </div>

        <Footer />

      </div>

    </div>
  );
}

export default App;