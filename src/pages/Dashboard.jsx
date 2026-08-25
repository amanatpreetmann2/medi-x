import React, { useState } from "react";
import StatsCard from "../components/StatsCard";
import HealthChart from "../components/HealthChart";
import healthBanner from "../assets/health-banner.jpg";
import {
  Activity,
  Calendar,
  Check,
  FileText,
  Pill,
  User,
  UserRound,
  HeartPulse,
  Clock,
  Sparkles
} from "lucide-react";

function Dashboard({ setPage, showToast, onOpenBookAppointment }) {
  const [medications, setMedications] = useState([
    { id: 1, name: "Lisinopril (10mg)", schedule: "1 tablet daily, Morning", taken: true },
    { id: 2, name: "Atorvastatin (20mg)", schedule: "1 tablet daily, Evening", taken: false }
  ]);

  const toggleMedication = (id) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        const nextState = !med.taken;
        if (showToast) {
          showToast(
            nextState
              ? `Marked ${med.name} as TAKEN ✓`
              : `${med.name} marked as Upcoming`,
            'success'
          );
        }
        return { ...med, taken: nextState };
      }
      return med;
    }));
  };

  return (
    <main className="content">
      {/* Welcome Banner */}
      <div
        className="welcome-banner"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7, 83, 154, 0.85),
              rgba(8, 123, 130, 0.45)
            ),
            url(${healthBanner})
          `,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(7, 83, 154, 0.15)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#FFF', marginBottom: '0.75rem', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} /> Patient Health Overview
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>Welcome Back 👋</h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>Here is your real-time health summary for today.</p>
        </div>
      </div>

      {/* Colorful Stats Cards Grid */}
      <div className="stats-container">
        <StatsCard
          title="Appointments"
          value="12"
          colorScheme="blue"
          icon={<Calendar size={26} />}
          onClick={() => setPage("Appointments")}
        />

        <StatsCard
          title="Doctors"
          value="8"
          colorScheme="green"
          icon={<UserRound size={26} />}
          onClick={() => setPage("Doctors")}
        />

        <StatsCard
          title="Medicines"
          value="24"
          colorScheme="purple"
          icon={<Pill size={26} />}
          onClick={() => setPage("Medications")}
        />

        <StatsCard
          title="Health Score"
          value="92%"
          colorScheme="rose"
          icon={<HeartPulse size={26} />}
          onClick={() => setPage("Reports")}
        />
      </div>

      {/* Interactive Health Vitals & Trends Chart Widget */}
      <HealthChart />

      {/* Dashboard Headings */}
      <div className="dashboard-headings">
        <h2>Health Records</h2>
        <div className="upcoming-heading">
          <h2>Upcoming</h2>
          <button onClick={() => setPage("Appointments")}>
            View All
          </button>
        </div>
      </div>

      {/* Colorful Health Cards Grid */}
      <div className="dashboard-grid">
        {/* Lab Results Card */}
        <div className="health-card" style={{ borderLeft: '4px solid #0284C7', background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeftWidth: '4px', borderLeftColor: '#0284C7', padding: '18px', position: 'relative' }}>
          <div className="health-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#0284C7', letterSpacing: '0.05em', background: '#E0F2FE', padding: '4px 8px', borderRadius: '6px' }}>
              RECENT LAB RESULTS
            </span>
            <FileText size={18} color="#0284C7" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text)' }}>
            Comprehensive Metabolic Panel
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Oct 10, 2023
          </span>
          <div className="normal-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '12px', marginTop: '12px' }}>
            <Check size={14} /> Normal
          </div>
          <button
            onClick={() => setPage("Reports")}
            style={{ position: 'absolute', bottom: '14px', right: '14px', border: 'none', background: '#E0F2FE', color: '#0284C7', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            View Report
          </button>
        </div>

        {/* Vaccine Card */}
        <div className="health-card" style={{ borderLeft: '4px solid #10B981', background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeftWidth: '4px', borderLeftColor: '#10B981', padding: '18px' }}>
          <div className="health-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.05em', background: '#D1FAE5', padding: '4px 8px', borderRadius: '6px' }}>
              IMMUNIZATIONS
            </span>
            <Activity size={18} color="#10B981" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text)' }}>
            Flu Vaccine
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Annual Dose
          </span>
          <div className="normal-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '12px', marginTop: '12px' }}>
            <Check size={14} /> Up to Date
          </div>
        </div>

        {/* Appointment Card */}
        <div className="upcoming-card" style={{ background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeft: '4px solid #F59E0B', padding: '18px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={onOpenBookAppointment}>
          <div className="upcoming-date" style={{ width: '60px', height: '65px', background: '#FEF3C7', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
            <small style={{ fontSize: '10px', fontWeight: 800 }}>OCT</small>
            <strong style={{ fontSize: '24px', fontWeight: 800 }}>14</strong>
          </div>
          <div className="upcoming-info">
            <strong style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
              Cardiology Follow-up
            </strong>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <Clock size={14} color="#D97706" /> 10:30 AM
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
              <User size={14} color="#0284C7" /> Dr. Alan Smith
            </span>
          </div>
        </div>
      </div>

      <h2 className="section-heading">Interactive Medication Tracker</h2>

      {/* Interactive Medications Box */}
      <div className="medication-box" style={{ background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {medications.map(med => (
          <div key={med.id} className="medication-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="medicine-icon" style={{ width: '44px', height: '44px', borderRadius: '50%', background: med.taken ? '#D1FAE5' : '#E0E7FF', color: med.taken ? '#059669' : '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Pill size={20} />
            </div>
            <div className="medicine-details" style={{ flex: 1 }}>
              <strong style={{ fontSize: '14px', color: 'var(--text)' }}>{med.name}</strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{med.schedule}</span>
            </div>
            <span
              className="taken-badge"
              style={{
                background: med.taken ? '#D1FAE5' : '#E0E7FF',
                color: med.taken ? '#047857' : '#4338CA',
                fontWeight: 700,
                fontSize: '11px',
                padding: '5px 14px',
                borderRadius: '20px'
              }}
            >
              {med.taken ? 'Taken' : 'Upcoming'}
            </span>
            <button
              onClick={() => toggleMedication(med.id)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: med.taken ? '#059669' : 'white',
                border: med.taken ? 'none' : '2px solid #C7D2FE',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Click to toggle taken status"
            >
              {med.taken && <Check size={16} />}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;