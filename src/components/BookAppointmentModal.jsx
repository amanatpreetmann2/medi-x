import React, { useState } from 'react';
import { Calendar, X, Video, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import { validateRequired, validateFutureDate, validateMinLength } from '../utils/formValidators';

export default function BookAppointmentModal({ isOpen, onClose, onConfirm }) {
  const [isSuccess, setIsSuccess] = useState(false);

  // Default date: 3 days in future (YYYY-MM-DD)
  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    // If it falls on Sunday, shift to Monday
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Validation function for the appointment booking form
  const validateAppointment = (values) => {
    const errors = {};
    
    const specErr = validateRequired(values.specialty, 'Specialty');
    if (specErr) errors.specialty = specErr;

    const docErr = validateRequired(values.doctor, 'Doctor');
    if (docErr) errors.doctor = docErr;

    const dateErr = validateFutureDate(values.date);
    if (dateErr) errors.date = dateErr;

    const timeErr = validateRequired(values.time, 'Time slot');
    if (timeErr) errors.time = timeErr;

    const reasonErr = validateMinLength(values.reason, 4, 'Reason / Symptoms');
    if (reasonErr) errors.reason = reasonErr;

    return errors;
  };

  // Submit handler passed to useForm
  const handleBookingSubmit = async (values) => {
    setIsSuccess(true);
    setTimeout(() => {
      if (onConfirm) {
        onConfirm({
          doctor: values.doctor,
          specialty: values.specialty,
          visitType: values.visitType,
          time: values.time,
          date: values.date,
          reason: values.reason
        });
      }
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1200);
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm
  } = useForm(
    {
      specialty: 'Cardiology',
      doctor: 'Dr. Alan Smith',
      visitType: 'Telehealth',
      date: defaultFutureDate(),
      time: '10:30 AM',
      reason: ''
    },
    validateAppointment,
    handleBookingSubmit
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 30, 50, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid var(--border)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '490px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          position: 'relative',
          animation: 'cardFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Book Appointment</h2>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Controlled React Form with Live Validation</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: '#F1F5F9', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Specialty */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                Medical Specialty <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                name="specialty"
                value={values.specialty}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: touched.specialty && errors.specialty ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                  background: 'var(--color-white)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="Cardiology">Cardiology & Heart Care</option>
                <option value="Dermatology">Dermatology & Skin</option>
                <option value="Neurology">Neurology & Brain Health</option>
                <option value="General Medicine">General Family Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
              {touched.specialty && errors.specialty && (
                <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.specialty}
                </div>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                Choose Physician <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                name="doctor"
                value={values.doctor}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: touched.doctor && errors.doctor ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                  background: 'var(--color-white)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="Dr. Alan Smith">Dr. Alan Smith (Cardiologist)</option>
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiovascular Specialist)</option>
                <option value="Dr. Emily Vance">Dr. Emily Vance (Dermatologist)</option>
                <option value="Dr. Michael Chang">Dr. Michael Chang (General Medicine)</option>
              </select>
              {touched.doctor && errors.doctor && (
                <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.doctor}
                </div>
              )}
            </div>

            {/* Visit Type */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                Visit Format
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFieldValue('visitType', 'Telehealth')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: values.visitType === 'Telehealth' ? '2px solid #0284C7' : '1px solid var(--border)',
                    background: values.visitType === 'Telehealth' ? '#E0F2FE' : 'var(--color-white)',
                    color: values.visitType === 'Telehealth' ? '#0284C7' : 'var(--text)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Video size={16} /> Telehealth
                </button>
                <button
                  type="button"
                  onClick={() => setFieldValue('visitType', 'In-Person')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: values.visitType === 'In-Person' ? '2px solid #0284C7' : '1px solid var(--border)',
                    background: values.visitType === 'In-Person' ? '#E0F2FE' : 'var(--color-white)',
                    color: values.visitType === 'In-Person' ? '#0284C7' : 'var(--text)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserCheck size={16} /> In-Clinic
                </button>
              </div>
            </div>

            {/* Date & Time with Validation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Appointment Date <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: touched.date && errors.date ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px'
                  }}
                />
                {touched.date && errors.date && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.date}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Time Slot <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '10px',
                    border: touched.time && errors.time ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px'
                  }}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
                {touched.time && errors.time && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.time}
                  </div>
                )}
              </div>
            </div>

            {/* Chief Complaint / Symptoms Reason */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                Reason for Visit / Symptoms <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                name="reason"
                rows="2"
                placeholder="Briefly describe your symptoms or routine checkup purpose..."
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: touched.reason && errors.reason ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                  background: 'var(--color-white)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
              {touched.reason && errors.reason ? (
                <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.reason}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  Provide at least 4 characters for clinical intake.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: '#0284C7',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Validating & Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Appointment Confirmed!</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              Scheduled with <strong>{values.doctor}</strong> for {values.date} at {values.time}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
