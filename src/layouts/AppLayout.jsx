import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import BookAppointmentModal from '../components/BookAppointmentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDispatch } from 'react-redux';
import { addAppointment, loadPatientAppointments } from '../store/slices/appointmentsSlice';
import { loadPatientMedications } from '../store/slices/medicationsSlice';
import { loadPatientReports } from '../store/slices/reportsSlice';
import { getActivePatientId } from '../utils/hospitalStore';

export default function AppLayout() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const patientId = user?.patientId || user?.id || getActivePatientId();

  // Sync Redux slices whenever active patient changes or on reload
  useEffect(() => {
    if (patientId) {
      dispatch(loadPatientMedications(patientId));
      dispatch(loadPatientAppointments(patientId));
      dispatch(loadPatientReports(patientId));
    }
  }, [patientId, dispatch]);

  const handleConfirmBooking = (appointmentData) => {
    dispatch(addAppointment({ patientId, appointmentData }));
    showToast(`Appointment scheduled with ${appointmentData.doctor}!`, 'success');
  };

  return (
    <div className="app">
      {/* Sidebar with Navigation Links */}
      <Sidebar onOpenBookAppointment={() => setIsBookModalOpen(true)} />

      {/* Main Content Area */}
      <div className="main-area">
        <Topbar />
        <Breadcrumbs />

        <div className="page-outlet-container" style={{ flex: 1 }}>
          <Outlet />
        </div>

        <Footer />
      </div>

      {/* Global Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
