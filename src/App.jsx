import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

// Layout & Route Guards
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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
import ArchitectureGuide from "./pages/ArchitectureGuide";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Healthcare Portal Layout Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="medications" element={<Medications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="email-notifications" element={<EmailNotifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="support" element={<Support />} />
                <Route path="architecture" element={<ArchitectureGuide />} />
              </Route>

              {/* 404 Not Found Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;