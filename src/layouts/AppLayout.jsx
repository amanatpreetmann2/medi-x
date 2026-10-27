import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import BookAppointmentModal from '../components/BookAppointmentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDispatch } from 'react-redux';
import { addAppointment } from '../store/slices/appointmentsSlice';

export default function AppLayout() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const handleConfirmBooking = (appointmentData) => {
    const patientId = user?.patientId || user?.id || 'MX-1001';
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
