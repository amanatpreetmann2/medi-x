import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  saveRegisteredAccount
} from '../utils/authStorage';
import { getPatientById } from '../utils/hospitalStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initialAuth = getStoredAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [user, setUser] = useState(
    initialAuth.user || getPatientById('MX-1001')
  );
  const [loading, setLoading] = useState(false);

  // Sync with localStorage on changes
  const login = (userData) => {
    const matchedPatient = getPatientById(userData.patientId) || userData;
    const finalUser = { ...matchedPatient, ...userData };
    setUser(finalUser);
    setIsLoggedIn(true);
    setStoredAuth(finalUser);
  };

  const logout = () => {
    clearStoredAuth();
    setIsLoggedIn(false);
    setUser(null);
  };

  const switchPatient = (patient) => {
    setUser(patient);
    setStoredAuth(patient);
  };

  const updateUser = (updatedFields) => {
    const updated = {
      ...(user || {}),
      ...updatedFields
    };
    setUser(updated);
    setStoredAuth(updated);
    saveRegisteredAccount(updated);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    switchPatient,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
