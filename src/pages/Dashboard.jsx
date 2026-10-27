import React from "react";
import { useNavigate } from "react-router-dom";
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
  HeartPulse,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { getPatientById } from "../utils/hospitalStore";
import { useSelector, useDispatch } from "react-redux";
import { selectAllAppointments } from "../store/slices/appointmentsSlice";
import { selectAllMedications, toggleDose } from "../store/slices/medicationsSlice";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Dashboard({ setPage: propSetPage, showToast: propShowToast, user: propUser }) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { showToast: contextShowToast } = useToast();
  const user = propUser || authUser;
  const showToast = propShowToast || contextShowToast;

  const dispatch = useDispatch();
  const appointments = useSelector(selectAllAppointments);
  const medications = useSelector(selectAllMedications);

  const patientId = user?.patientId || user?.id || 'MX-1001';
  const patient = getPatientById(patientId);

  // Navigate helper that supports both router navigation and fallback setPage
  const goTo = (pageName) => {
    if (propSetPage) propSetPage(pageName);
    const routeMap = {
      Dashboard: '/dashboard',
      Appointments: '/appointments',
      Medications: '/medications',
      Reports: '/reports',
      Profile: '/profile',
      Settings: '/settings',
      Notifications: '/notifications'
    };
    navigate(routeMap[pageName] || '/dashboard');
  };

  const toggleMed = (med) => {
    dispatch(toggleDose({ patientId, medId: med.id }));
    const nextState = !med.taken;
    const msg = nextState
      ? `Marked ${med.name} as TAKEN ✓`
      : `${med.name} marked as Pending`;
    if (showToast) showToast(msg, 'success');
  };

  // Find next upcoming appointment from Redux store
  const nextAppt = appointments.find((a) => a.status === 'Upcoming') || appointments[0];

  const apptCount = appointments.length;
  const medCount = medications.length;
  const reportCount = (patient?.reports || []).length || 3;

  return (
    <main className="content">
      {/* Welcome Banner */}
      <div
        className="welcome-banner"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7, 83, 154, 0.88),
              rgba(8, 123, 130, 0.65)
            ),
            url(${healthBanner})
          `,
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(7, 83, 154, 0.15)',
          padding: '28px 24px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#FFF', marginBottom: '0.75rem', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} /> Evaluation Patient: {patient?.name} (ID: {patient?.id})
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Welcome Back{patient?.name ? `, ${patient.name}` : ''} 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 12px 0' }}>
            Blood Group: <strong>{patient?.bloodGroup}</strong> • Age: <strong>{patient?.age} yrs</strong> • Vitals: BP {patient?.vitals?.bp}, Pulse {patient?.vitals?.pulse}
          </p>

          {/* Allergies Notice */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.3)', border: '1px solid rgba(254, 202, 202, 0.5)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#FFF' }}>
            <ShieldAlert size={14} />
            <span>Allergies: {(patient?.knownAllergies || []).map(a => `${a.allergen} (${a.severity})`).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Colorful Stats Cards Grid */}
      <div className="stats-container">
        <StatsCard
          title="Appointments"
          value={String(apptCount)}
          colorScheme="blue"
          icon={<Calendar size={26} />}
          onClick={() => goTo("Appointments")}
        />

        <StatsCard
          title="My Medicines"
          value={String(medCount)}
          colorScheme="purple"
          icon={<Pill size={26} />}
          onClick={() => goTo("Medications")}
        />

        <StatsCard
          title="Health Records"
          value={String(reportCount)}
          colorScheme="green"
          icon={<FileText size={26} />}
          onClick={() => goTo("Reports")}
        />

        <StatsCard
          title="Blood Pressure"
          value={patient?.vitals?.bp?.split(' ')?.[0] || "120/80"}
          colorScheme="rose"
          icon={<HeartPulse size={26} />}
          onClick={() => goTo("Profile")}
        />
      </div>

      {/* Interactive Health Vitals & Trends Chart Widget */}
      <HealthChart />

      {/* Dashboard Headings */}
      <div className="dashboard-headings">
        <h2>Health Records & Lab Status</h2>
        <div className="upcoming-heading">
          <h2>Next Upcoming Appointment</h2>
          <button onClick={() => goTo("Appointments")}>
            View All ({apptCount})
          </button>
        </div>
      </div>

      {/* Colorful Health Cards Grid */}
      <div className="dashboard-grid">
        {/* Lab Results Card */}
        <div className="health-card" style={{ borderLeft: '4px solid #0284C7', background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeftWidth: '4px', borderLeftColor: '#0284C7', padding: '18px', position: 'relative' }}>
          <div className="health-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#0284C7', letterSpacing: '0.05em', background: '#E0F2FE', padding: '4px 8px', borderRadius: '6px' }}>
              LAB WORK
            </span>
            <FileText size={18} color="#0284C7" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text)' }}>
            {patient?.reports?.[0]?.title || "Comprehensive Metabolic Panel"}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {patient?.reports?.[0]?.date || "Recent Lab Result"}
          </span>
          <div className="normal-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '12px', marginTop: '12px' }}>
            <Check size={14} /> {patient?.reports?.[0]?.status || "NORMAL"}
          </div>
          <button
            onClick={() => goTo("Reports")}
            style={{ position: 'absolute', bottom: '14px', right: '14px', border: 'none', background: '#E0F2FE', color: '#0284C7', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            View Report
          </button>
        </div>

        {/* Diagnostic Imaging Card */}
        <div className="health-card" style={{ borderLeft: '4px solid #10B981', background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeftWidth: '4px', borderLeftColor: '#10B981', padding: '18px' }}>
          <div className="health-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.05em', background: '#D1FAE5', padding: '4px 8px', borderRadius: '6px' }}>
              CLINICAL DIAGNOSTICS
            </span>
            <Activity size={18} color="#10B981" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text)' }}>
            {patient?.reports?.[1]?.title || "Resting 12-Lead ECG"}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {patient?.reports?.[1]?.date || "Sep 2026"}
          </span>
          <div className="normal-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '12px', marginTop: '12px' }}>
            <Check size={14} /> Clear / Normal
          </div>
        </div>

        {/* Appointment Card */}
        {nextAppt ? (
          <div
            className="upcoming-card"
            style={{ background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', borderLeft: '4px solid #F59E0B', padding: '18px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            onClick={() => goTo("Appointments")}
          >
            <div className="upcoming-date" style={{ width: '60px', height: '65px', background: '#FEF3C7', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
              <small style={{ fontSize: '10px', fontWeight: 800 }}>{nextAppt.month || 'NOV'}</small>
              <strong style={{ fontSize: '22px', fontWeight: 800 }}>{nextAppt.day || '04'}</strong>
            </div>
            <div className="upcoming-info">
              <strong style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                {nextAppt.reason}
              </strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                <Clock size={14} color="#D97706" /> {nextAppt.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                <User size={14} color="#0284C7" /> {nextAppt.doctor} ({nextAppt.specialty})
              </span>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--color-card-bg, #FFFFFF)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ margin: 0, color: 'var(--muted, #64748B)', fontSize: '13px' }}>No upcoming appointments</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 12px 0' }}>
        <h2 className="section-heading" style={{ margin: 0 }}>
          Daily Medication Schedule ({medications.length} Prescriptions)
        </h2>
        <button
          onClick={() => goTo("Medications")}
          style={{ background: 'none', border: 'none', color: 'var(--blue, #0B4F8A)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          View 4-Slot Schedule <ChevronRight size={16} />
        </button>
      </div>

      {/* Interactive Medications Box */}
      <div className="medication-box" style={{ background: 'var(--color-white)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {medications.map(med => (
          <div key={med.id} className="medication-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="medicine-icon" style={{ width: '44px', height: '44px', borderRadius: '50%', background: med.taken ? '#D1FAE5' : '#E0E7FF', color: med.taken ? '#059669' : '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Pill size={20} />
            </div>
            <div className="medicine-details" style={{ flex: 1 }}>
              <strong style={{ fontSize: '14px', color: 'var(--text)' }}>{med.name} ({med.dosage})</strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>
                {med.period} at {med.time} • {med.instructions}
              </span>
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
              {med.taken ? 'Taken ✓' : 'Due'}
            </span>
            <button
              onClick={() => toggleMed(med)}
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