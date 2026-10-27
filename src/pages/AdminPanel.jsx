import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Pill,
  Mail,
  RotateCcw,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  getAllPatients,
  getEmailRecipients,
  getEmailLogs,
  getDoseLogs,
  resetToDemoDefaults,
  getPatientById,
  bookAppointment
} from "../utils/hospitalStore";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminPanel({ onSwitchPatient: propOnSwitch, showToast: propShowToast }) {
  const { switchPatient } = useAuth();
  const { showToast: contextShowToast } = useToast();
  const onSwitchPatient = propOnSwitch || switchPatient;
  const showToast = propShowToast || contextShowToast;

  const [patients, setPatients] = useState(getAllPatients());
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'MX-1001');
  const selectedPatient = getPatientById(selectedPatientId) || patients[0];

  const [emailLogs, setEmailLogs] = useState(getEmailLogs());
  const [doseLogs, setDoseLogs] = useState(getDoseLogs());
  const [recipients, setRecipients] = useState(getEmailRecipients());
  const [toastMessage, setToastMessage] = useState("");

  // Appointment creation form in Admin
  const [adminApptDoctor, setAdminApptDoctor] = useState("Dr. Sarah Jenkins");
  const [adminApptSpecialty, setAdminApptSpecialty] = useState("Cardiology");
  const [adminApptDate, setAdminApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [adminApptTime, setAdminApptTime] = useState("11:00 AM");
  const [adminApptReason, setAdminApptReason] = useState("");

  const notify = (msg) => {
    setToastMessage(msg);
    if (showToast) showToast(msg, 'success');
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleResetDemoData = () => {
    if (window.confirm("Reset all patient records, medicine doses, and email logs to factory evaluation state?")) {
      const resetPatients = resetToDemoDefaults();
      setPatients(resetPatients);
      setEmailLogs([]);
      setDoseLogs([]);
      setRecipients(getEmailRecipients());
      notify("✓ All data successfully reset to clean factory demo state.");
    }
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!adminApptDoctor || !adminApptDate) return;

    bookAppointment(selectedPatientId, {
      doctor: adminApptDoctor,
      specialty: adminApptSpecialty,
      date: adminApptDate,
      time: adminApptTime,
      reason: adminApptReason || 'Administrative Scheduled Visit',
      department: 'Main Outpatient Clinic'
    });

    setPatients(getAllPatients());
    setAdminApptReason("");
    notify(`Appointment created for ${selectedPatient.name}`);
  };

  return (
    <main className="content">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 600,
            zIndex: 9999
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN HEADER */}
      <PageHeader
        badge="Evaluation Control Room"
        badgeIcon={ShieldCheck}
        title="Administrator & Evaluation Demo Mode"
        subtitle="Supervise fictional patient records, appointments, prescriptions, and email notifications for academic demonstration."
        actions={
          <button
            type="button"
            onClick={handleResetDemoData}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#FFF1F2",
              color: "#E11D48",
              border: "1px solid #FECDD3",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer"
            }}
            title="Restore original demo records"
          >
            <RotateCcw size={16} />
            Reset Demo Data to Factory State
          </button>
        }
      />

      {/* METRIC CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Demo Patients</span>
            <Users size={20} color="#38BDF8" />
          </div>
          <h3 style={{ margin: "10px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>3 Profiles</h3>
          <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600 }}>Active & Differentiated</span>
        </div>

        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Email Recipients</span>
            <Mail size={20} color="#2DD4BF" />
          </div>
          <h3 style={{ margin: "10px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{recipients.length} Configured</h3>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Evaluator & Presenter</span>
        </div>

        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Email Logs</span>
            <Clock size={20} color="#A78BFA" />
          </div>
          <h3 style={{ margin: "10px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{emailLogs.length} Dispatches</h3>
          <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600 }}>Audited & Recorded</span>
        </div>

        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Dose History Logs</span>
            <Pill size={20} color="#FBBF24" />
          </div>
          <h3 style={{ margin: "10px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{doseLogs.length} Actions</h3>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Compliance tracking</span>
        </div>
      </div>

      {/* DEMO PATIENT SELECTOR & INSPECTOR */}
      <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", marginBottom: "26px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
        <h2 style={{ margin: "0 0 14px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text)" }}>
          Inspect & Switch Demo Patient Records
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          {patients.map(p => {
            const isSelected = selectedPatientId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                style={{
                  border: isSelected ? "2px solid #38BDF8" : "1px solid var(--border)",
                  background: isSelected ? "rgba(56, 189, 248, 0.12)" : "var(--color-card-bg, #FFFFFF)",
                  borderRadius: "14px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{p.name}</h3>
                    <span style={{ fontSize: "12px", color: "#2DD4BF", fontWeight: 700 }}>{p.id} • {p.gender}, {p.age} yrs</span>
                  </div>
                  {isSelected && (
                    <span style={{ background: "#0B4F8A", color: "#FFFFFF", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                      INSPECTING
                    </span>
                  )}
                </div>

                <p style={{ margin: "4px 0", fontSize: "12px", color: "var(--muted)" }}>
                  <strong style={{ color: "var(--text)" }}>Conditions:</strong> {(p.chronicConditions || []).join(', ')}
                </p>
                <p style={{ margin: "4px 0", fontSize: "12px", color: "var(--muted)" }}>
                  <strong style={{ color: "var(--text)" }}>BP:</strong> {p.vitals?.bp} • <strong style={{ color: "var(--text)" }}>Glucose:</strong> {p.vitals?.glucose}
                </p>
                <p style={{ margin: "4px 0 10px 0", fontSize: "12px", color: "var(--muted)" }}>
                  <strong style={{ color: "var(--text)" }}>Prescriptions:</strong> {p.medications?.length} active • <strong style={{ color: "var(--text)" }}>Appointments:</strong> {p.appointments?.length}
                </p>

                {onSwitchPatient && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwitchPatient(p);
                      notify(`Switched active portal view to ${p.name}`);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: isSelected ? "#0B4F8A" : "var(--color-subtle-bg, #F1F5F9)",
                      color: isSelected ? "#FFFFFF" : "var(--text)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    View Portal as {p.name.split(' ')[0]} →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Patient Detailed Overview */}
        <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "14px", padding: "18px", border: "1px solid var(--border, #E2E8F0)" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>
            Live Records for {selectedPatient.name} ({selectedPatient.id})
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div>
              <strong style={{ display: "block", fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                Scheduled Medicines ({selectedPatient.medications?.length})
              </strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(selectedPatient.medications || []).map(m => (
                  <div key={m.id} style={{ background: "var(--color-card-bg, #FFFFFF)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text)" }}>
                    <strong style={{ color: "var(--text)" }}>{m.name} ({m.dosage})</strong> - <span style={{ color: "var(--muted)" }}>{m.period} at {m.time}</span>
                    <span style={{ float: "right", color: m.taken ? "#10B981" : "#F59E0B", fontWeight: 700 }}>
                      {m.taken ? "Taken ✓" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                Appointments ({selectedPatient.appointments?.length})
              </strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(selectedPatient.appointments || []).map(a => (
                  <div key={a.id} style={{ background: "var(--color-card-bg, #FFFFFF)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text)" }}>
                    <strong style={{ color: "var(--text)" }}>{a.doctor}</strong> <span style={{ color: "var(--muted)" }}>({a.specialty})</span>
                    <div style={{ color: "var(--muted)" }}>{a.date} at {a.time} - {a.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK APPOINTMENT GENERATOR FOR EVALUATION */}
      <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
        <h2 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text)" }}>
          Add Fictional Appointment for Evaluation Demo
        </h2>
        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)" }}>
          Target Patient: <strong style={{ color: "var(--text)" }}>{selectedPatient.name}</strong> ({selectedPatient.id})
        </p>

        <form onSubmit={handleCreateAppointment} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>Doctor</label>
            <input
              type="text"
              required
              value={adminApptDoctor}
              onChange={(e) => setAdminApptDoctor(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>Specialty</label>
            <input
              type="text"
              required
              value={adminApptSpecialty}
              onChange={(e) => setAdminApptSpecialty(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>Date</label>
            <input
              type="date"
              required
              value={adminApptDate}
              onChange={(e) => setAdminApptDate(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>Time</label>
            <input
              type="text"
              required
              value={adminApptTime}
              onChange={(e) => setAdminApptTime(e.target.value)}
              placeholder="e.g. 11:00 AM"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>Reason for Visit</label>
            <input
              type="text"
              placeholder="e.g. Clinical evaluation"
              value={adminApptReason}
              onChange={(e) => setAdminApptReason(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "9px 18px",
              background: "#0B4F8A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              height: "38px"
            }}
          >
            + Create Record
          </button>
        </form>
      </div>
    </main>
  );
}
