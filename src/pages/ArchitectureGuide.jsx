import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePhone, validateRequired, validateMinLength } from '../utils/formValidators';
import PageHeader from '../components/PageHeader';
import {
  selectAppointmentStats,
  selectAllAppointments,
  addAppointment
} from '../store/slices/appointmentsSlice';
import {
  selectAllMedications,
  selectMedicationAdherence
} from '../store/slices/medicationsSlice';
import {
  Layers,
  Compass,
  Database,
  CheckCircle2,
  FileCheck2,
  Share2,
  Sun,
  Moon,
  Bell,
  Code2,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function ArchitectureGuide() {
  const [activeTab, setActiveTab] = useState('overview');

  // Context consumers
  const { user, isLoggedIn, switchPatient } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Redux state consumers
  const dispatch = useDispatch();
  const apptStats = useSelector(selectAppointmentStats);
  const allAppointments = useSelector(selectAllAppointments);
  const allMedications = useSelector(selectAllMedications);
  const adherenceScore = useSelector(selectMedicationAdherence);

  // Form Handling Demo hook
  const {
    values: formValues,
    errors: formErrors,
    touched: formTouched,
    handleChange: handleFormChange,
    handleBlur: handleFormBlur,
    handleSubmit: handleFormSubmit,
    resetForm: handleFormReset
  } = useForm(
    {
      patientName: user?.name || 'Dr. Kabir Patel',
      contactEmail: user?.email || 'patient@medix.com',
      contactPhone: user?.phone || '+1 (555) 234-5678',
      clinicalNotes: ''
    },
    (values) => {
      const errors = {};
      const nameErr = validateMinLength(values.patientName, 3, 'Full name');
      if (nameErr) errors.patientName = nameErr;

      const emailErr = validateEmail(values.contactEmail);
      if (emailErr) errors.contactEmail = emailErr;

      const phoneErr = validatePhone(values.contactPhone);
      if (phoneErr) errors.contactPhone = phoneErr;

      const notesErr = validateRequired(values.clinicalNotes, 'Clinical notes');
      if (notesErr) errors.clinicalNotes = notesErr;

      return errors;
    },
    async (values) => {
      showToast(`Form validated successfully! Submitted: ${values.patientName}`, 'success');
    }
  );

  return (
    <main className="content" style={{ padding: '24px 32px' }}>
      <PageHeader
        badge="Evaluation Component 2 Implementation"
        badgeIcon={Layers}
        title="Architecture & Rubrics Implementation"
        subtitle="Full implementation of Navigation Layout, Context API, Redux Toolkit, and Form Handling in React."
      />

      {/* RUBRIC SCORECARD HIGHLIGHT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px', borderLeft: '4px solid #0284C7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Component 1 (7-8 pts)</span>
            <Compass size={18} color="#0284C7" />
          </div>
          <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text)', marginBottom: '4px' }}>React Navigation Layout</strong>
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
            react-router-dom v7 layout routes, ProtectedRoute guards, breadcrumbs, and active navigation indicators.
          </small>
        </div>

        <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Component 2 (6-8 pts)</span>
            <Share2 size={18} color="#10B981" />
          </div>
          <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text)', marginBottom: '4px' }}>Context API & State</strong>
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
            Multi-context architecture (AuthContext, ThemeContext, ToastContext) with dedicated custom hooks.
          </small>
        </div>

        <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Component 3 (3-5 pts)</span>
            <Database size={18} color="#8B5CF6" />
          </div>
          <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text)', marginBottom: '4px' }}>Redux Toolkit</strong>
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
            Centralized configureStore, slices (appointments, medications, reports), selectors, and typed dispatches.
          </small>
        </div>

        <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Component 4 (3-4 pts)</span>
            <FileCheck2 size={18} color="#F59E0B" />
          </div>
          <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text)', marginBottom: '4px' }}>Form Handling</strong>
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
            Controlled forms with custom useForm hook, live validation, touched detection, and error feedback.
          </small>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: '1. Navigation & Page Structure' },
          { id: 'context', label: '2. Context API Architecture' },
          { id: 'redux', label: '3. Redux Toolkit Live Store' },
          { id: 'forms', label: '4. Form Handling Testbench' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-blue, #0284C7)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--muted)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: NAVIGATION & ROUTING */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', margin: '0 0 10px 0' }}>
              React Router Layout & Page Structure
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              The application uses <code>react-router-dom</code> with nested layout architecture:
            </p>

            <div style={{ background: 'var(--color-subtle-bg, #0F172A)', color: '#38BDF8', padding: '16px 20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, overflowX: 'auto' }}>
              {`BrowserRouter
├── Public Route: /login (renders LoginForm with credentials & Google Auth)
└── ProtectedRoute: / (requires active AuthContext session)
    └── AppLayout (persistent Sidebar + Topbar + Breadcrumbs + Footer)
        ├── Route: /dashboard (Health overview, vitals, adherence)
        ├── Route: /appointments (Redux-connected scheduling system)
        ├── Route: /reports (Diagnostic records & lab status)
        ├── Route: /medications (4-slot prescription tracking)
        ├── Route: /doctors (Physician directory)
        ├── Route: /notifications (Portal alerts)
        ├── Route: /email-notifications (Configurable SMTP triggers)
        ├── Route: /profile (Patient medical record)
        ├── Route: /settings (Preferences & credentials)
        ├── Route: /architecture (This Evaluation Component 2 Guide)
        └── Route: * (Custom 404 Fallback page)`}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  ✓ NavLink Active Indicators
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                  Sidebar navigation links dynamically apply active class and indicator styling based on current route match.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  ✓ Hierarchy Breadcrumbs
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                  The <code>&lt;Breadcrumbs /&gt;</code> component parses the current URL pathname and provides one-click parent navigation.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  ✓ Session Route Guards
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                  Unauthenticated requests are intercepted by <code>&lt;ProtectedRoute /&gt;</code> and redirected to <code>/login</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTEXT API */}
      {activeTab === 'context' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', margin: '0 0 10px 0' }}>
              Multi-Context Architecture & Live Testbench
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              State is cleanly separated into specialized React Contexts to avoid prop-drilling while keeping domain logic in Redux.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* AuthContext Panel */}
              <div style={{ padding: '18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--color-card-bg, #FFFFFF)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text)' }}>AuthContext (useAuth)</strong>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: isLoggedIn ? '#D1FAE5' : '#FEE2E2', color: isLoggedIn ? '#059669' : '#DC2626' }}>
                    {isLoggedIn ? 'Active Session' : 'Logged Out'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                  Current User: <strong>{user?.name}</strong> ({user?.email})<br />
                  Patient ID: <strong>{user?.patientId || user?.id}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      switchPatient({ id: 'MX-1002', name: 'Ananya Singh', email: 'ananya.singh@medix.com', patientId: 'MX-1002' });
                      showToast('Switched to Ananya Singh via AuthContext!', 'info');
                    }}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Switch to Ananya
                  </button>
                  <button
                    onClick={() => {
                      switchPatient({ id: 'MX-1001', name: 'Kabir Patel', email: 'kabir.patel@medix.com', patientId: 'MX-1001' });
                      showToast('Switched to Kabir Patel via AuthContext!', 'info');
                    }}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--color-white)', color: 'var(--text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Switch to Kabir
                  </button>
                </div>
              </div>

              {/* ThemeContext Panel */}
              <div style={{ padding: '18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--color-card-bg, #FFFFFF)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text)' }}>ThemeContext (useTheme)</strong>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: isDark ? '#1E293B' : '#FEF3C7', color: isDark ? '#38BDF8' : '#D97706' }}>
                    Mode: {theme.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
                  Syncs with <code>document.documentElement[data-theme]</code> and persists theme preference to <code>localStorage</code>.
                </div>
                <button
                  onClick={toggleTheme}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--color-blue, #0284C7)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  Toggle Theme via ThemeContext
                </button>
              </div>

              {/* ToastContext Panel */}
              <div style={{ padding: '18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--color-card-bg, #FFFFFF)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text)' }}>ToastContext (useToast)</strong>
                  <Bell size={16} color="#0284C7" />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
                  Global imperative notification dispatcher. Dispatches notifications anywhere in component tree.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => showToast('Success alert dispatched from ToastContext!', 'success')}
                    style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', background: '#10B981', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Success Toast
                  </button>
                  <button
                    onClick={() => showToast('Warning: Check vital signs!', 'error')}
                    style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', background: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Alert Toast
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REDUX TOOLKIT */}
      {activeTab === 'redux' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px 0' }}>
                  Redux Toolkit Store & Slices
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Active Redux slices: <code>appointmentsSlice</code>, <code>medicationsSlice</code>, <code>reportsSlice</code>
                </span>
              </div>
              <button
                onClick={() => {
                  const patientId = user?.patientId || user?.id || 'MX-1001';
                  dispatch(addAppointment({
                    patientId,
                    appointmentData: {
                      doctor: 'Dr. Kevin Reed',
                      specialty: 'Pulmonology',
                      date: new Date().toISOString().split('T')[0],
                      time: '11:00 AM',
                      department: 'Respiratory Care Suite',
                      reason: 'Redux Dispatch Demo Appointment'
                    }
                  }));
                  showToast('Dispatched addAppointment to Redux store!', 'success');
                }}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#8B5CF6', color: 'white', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} /> Dispatch Test Action
              </button>
            </div>

            {/* Live Redux Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Total Appointments</span>
                <strong style={{ fontSize: '20px', color: '#0284C7' }}>{apptStats.total}</strong>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Upcoming Visits</span>
                <strong style={{ fontSize: '20px', color: '#10B981' }}>{apptStats.upcoming}</strong>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Medications Loaded</span>
                <strong style={{ fontSize: '20px', color: '#8B5CF6' }}>{allMedications.length}</strong>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-card-bg, #F8FAFC)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Adherence Percentage</span>
                <strong style={{ fontSize: '20px', color: '#F59E0B' }}>{adherenceScore}%</strong>
              </div>
            </div>

            {/* Live Store State Preview */}
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text)' }}>
              Live Redux State Snapshot (useSelector)
            </h4>
            <div style={{ background: '#0F172A', color: '#A7F3D0', padding: '14px 18px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              {JSON.stringify({
                appointmentsCount: allAppointments.length,
                latestAppointment: allAppointments[0] || null,
                medicationsCount: allMedications.length,
                adherenceRate: `${adherenceScore}%`
              }, null, 2)}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FORM HANDLING */}
      {activeTab === 'forms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px 0' }}>
              Controlled Form Handling with Validation Engine
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              Built with custom <code>useForm</code> hook. Test validation rules: edit inputs, trigger blur events, and submit.
            </p>

            <form onSubmit={handleFormSubmit} noValidate style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* Patient Name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formValues.patientName}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: formTouched.patientName && formErrors.patientName ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                {formTouched.patientName && formErrors.patientName && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {formErrors.patientName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Email Address <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formValues.contactEmail}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: formTouched.contactEmail && formErrors.contactEmail ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                {formTouched.contactEmail && formErrors.contactEmail && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {formErrors.contactEmail}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Phone Number <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formValues.contactPhone}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: formTouched.contactPhone && formErrors.contactPhone ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                {formTouched.contactPhone && formErrors.contactPhone && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {formErrors.contactPhone}
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Clinical Intake Notes <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="clinicalNotes"
                  placeholder="e.g. Follow-up consultation"
                  value={formValues.clinicalNotes}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: formTouched.clinicalNotes && formErrors.clinicalNotes ? '1.5px solid #EF4444' : '1.5px solid var(--border)',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                {formTouched.clinicalNotes && formErrors.clinicalNotes && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {formErrors.clinicalNotes}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#F59E0B',
                    color: 'white',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Validate & Submit Form
                </button>
                <button
                  type="button"
                  onClick={() => handleFormReset()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: 'var(--color-white)',
                    color: 'var(--text)',
                    border: '1.5px solid var(--border)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
