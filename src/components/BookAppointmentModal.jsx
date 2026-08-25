import React, { useState } from 'react';
import { Calendar, X, Clock, Video, UserCheck, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose, onConfirm }) {
  const [specialty, setSpecialty] = useState('Cardiology');
  const [doctor, setDoctor] = useState('Dr. Alan Smith');
  const [visitType, setVisitType] = useState('Telehealth');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [dateInput, setDateInput] = useState('2026-08-28');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      if (onConfirm) {
        onConfirm({
          doctor,
          specialty,
          visitType,
          time: selectedTime,
          date: dateInput
        });
      }
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 30, 50, 0.5)',
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
          maxWidth: '460px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          position: 'relative',
          animation: 'cardFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Book Appointment</h2>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Select your doctor and schedule a visit</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#F1F5F9', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Specialty */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Select Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
              >
                <option value="Cardiology">Cardiology & Heart Care</option>
                <option value="Dermatology">Dermatology & Skin</option>
                <option value="Neurology">Neurology & Brain Health</option>
                <option value="General Medicine">General Family Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Choose Doctor
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
              >
                <option value="Dr. Alan Smith">Dr. Alan Smith (Cardiologist)</option>
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Neurologist)</option>
                <option value="Dr. Emily Vance">Dr. Emily Vance (Dermatologist)</option>
                <option value="Dr. Michael Chang">Dr. Michael Chang (General Medicine)</option>
              </select>
            </div>

            {/* Visit Type */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Visit Format
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setVisitType('Telehealth')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: visitType === 'Telehealth' ? '2px solid #0284C7' : '1px solid var(--border)', background: visitType === 'Telehealth' ? '#E0F2FE' : 'var(--color-white)', color: visitType === 'Telehealth' ? '#0284C7' : 'var(--text)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Video size={16} /> Telehealth Video
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('In-Person')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: visitType === 'In-Person' ? '2px solid #0284C7' : '1px solid var(--border)', background: visitType === 'In-Person' ? '#E0F2FE' : 'var(--color-white)', color: visitType === 'In-Person' ? '#0284C7' : 'var(--text)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <UserCheck size={16} /> Clinic Visit
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '13px' }}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0284C7', color: 'white', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
            >
              Confirm Appointment
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Appointment Confirmed!</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              Scheduled with <strong>{doctor}</strong> for {dateInput} at {selectedTime}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
