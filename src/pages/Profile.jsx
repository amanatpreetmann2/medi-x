import React, { useState } from "react";
import {
  User,
  ShieldAlert,
  Phone,
  Activity,
  CheckCircle2,
  Edit2,
  FileText
} from "lucide-react";
import { getPatientById, updatePatient } from "../utils/hospitalStore";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Profile({ user: propUser, onUpdateUser: propUpdateUser, showToast: propShowToast }) {
  const { user: authUser, updateUser: authUpdateUser } = useAuth();
  const { showToast: contextShowToast } = useToast();
  const user = propUser || authUser;
  const onUpdateUser = propUpdateUser || authUpdateUser;
  const showToast = propShowToast || contextShowToast;

  const patientId = user?.patientId || user?.id || 'MX-1001';
  const initialPatient = getPatientById(patientId);

  const [patient, setPatient] = useState(initialPatient);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Edit form state
  const [name, setName] = useState(patient?.name || "");
  const [phone, setPhone] = useState(patient?.phone || "");
  const [email, setEmail] = useState(patient?.email || "");
  const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || "A+");
  const [emergencyName, setEmergencyName] = useState(patient?.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(patient?.emergencyContact?.phone || "");
  const [emergencyRel, setEmergencyRel] = useState(patient?.emergencyContact?.relationship || "Family");
  const [medicalHistory, setMedicalHistory] = useState(patient?.medicalHistory || "");

  // Update whenever patientId changes
  React.useEffect(() => {
    const p = getPatientById(patientId);
    setPatient(p);
    setName(p?.name || "");
    setPhone(p?.phone || "");
    setEmail(p?.email || "");
    setBloodGroup(p?.bloodGroup || "A+");
    setEmergencyName(p?.emergencyContact?.name || "");
    setEmergencyPhone(p?.emergencyContact?.phone || "");
    setEmergencyRel(p?.emergencyContact?.relationship || "Family");
    setMedicalHistory(p?.medicalHistory || "");
  }, [patientId]);

  const handleSave = (e) => {
    e.preventDefault();

    const updates = {
      name,
      phone,
      email,
      bloodGroup,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRel
      },
      medicalHistory
    };

    const updated = updatePatient(patientId, updates);
    if (updated) {
      setPatient(updated);
      setIsEditing(false);
      if (onUpdateUser) {
        onUpdateUser({ name, email, phone });
      }
      const msg = "✓ Profile details updated and saved successfully";
      setToastMessage(msg);
      if (showToast) showToast(msg, 'success');
      setTimeout(() => setToastMessage(""), 3500);
    }
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
            zIndex: 9999,
            animation: "fadeInUp 0.3s ease"
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <PageHeader
        badge="Patient Demographics"
        badgeIcon={User}
        title="My Profile"
        subtitle={
          <>
            Official electronic medical record and contact details for <strong>{patient?.name}</strong>.
          </>
        }
        actions={
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isEditing ? "var(--color-subtle-bg, #F1F5F9)" : "linear-gradient(135deg, #0B4F8A 0%, #0070BA 100%)",
              color: isEditing ? "var(--text, #334155)" : "#FFFFFF",
              padding: "10px 18px",
              borderRadius: "10px",
              border: isEditing ? "1px solid var(--border, #CBD5E1)" : "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: isEditing ? "none" : "0 4px 14px rgba(11, 79, 138, 0.25)"
            }}
          >
            <Edit2 size={16} />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        }
      />

      {/* EDIT FORM OR DISPLAY CARDS */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          style={{
            background: "var(--color-card-bg, #FFFFFF)",
            border: "1.5px solid var(--blue, #0B4F8A)",
            borderRadius: "16px",
            padding: "26px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            marginBottom: "24px"
          }}
        >
          <h2 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
            Edit Patient Profile
          </h2>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--muted, #64748B)" }}>
            Modify patient demographic and emergency contact records. Changes persist to localStorage.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <h3 style={{ margin: "24px 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "var(--text, #0F172A)", borderTop: "1px solid var(--border, #E2E8F0)", paddingTop: "16px" }}>
            Emergency Contact Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Relationship</label>
              <input
                type="text"
                value={emergencyRel}
                onChange={(e) => setEmergencyRel(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Contact Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Medical History & Clinical Notes</label>
            <textarea
              rows={3}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", background: "var(--color-subtle-bg, #FFFFFF)", color: "var(--text, #475569)", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: "9px 22px", borderRadius: "8px", border: "none", background: "#0B4F8A", color: "#FFFFFF", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      ) : null}

      {/* PROFILE DETAILS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        
        {/* Card 1: Core Demographics */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0B4F8A, #00A896)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "20px"
              }}
            >
              {patient?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: "0 0 2px 0", fontSize: "1.3rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                {patient?.name}
              </h2>
              <span style={{ fontSize: "13px", color: "var(--teal, #00A896)", fontWeight: 700 }}>
                Patient ID: {patient?.id}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", borderTop: "1px solid var(--border, #F1F5F9)", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Age / Gender:</span>
              <strong style={{ color: "var(--text, #0F172A)" }}>{patient?.age} yrs • {patient?.gender}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Date of Birth:</span>
              <strong style={{ color: "var(--text, #0F172A)" }}>{patient?.dob}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Blood Group:</span>
              <span style={{ background: "#FEE2E2", color: "#991B1B", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                {patient?.bloodGroup}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Email:</span>
              <strong style={{ color: "var(--text, #0F172A)" }}>{patient?.email}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Contact Phone:</span>
              <strong style={{ color: "var(--text, #0F172A)" }}>{patient?.phone}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted, #64748B)" }}>Primary Physician:</span>
              <strong style={{ color: "var(--blue, #0B4F8A)" }}>{patient?.primaryPhysician}</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Clinical Vitals & Current Health */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ background: "var(--light-blue, #EFF6FF)", color: "var(--blue, #0B4F8A)", padding: "8px", borderRadius: "10px" }}>
              <Activity size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
              Current Vitals & Health Metrics
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)", textTransform: "uppercase", fontWeight: 700 }}>Blood Pressure</span>
              <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{patient?.vitals?.bp}</p>
              <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>{patient?.vitals?.bpStatus}</span>
            </div>

            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)", textTransform: "uppercase", fontWeight: 700 }}>Pulse / Heart Rate</span>
              <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{patient?.vitals?.pulse}</p>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)" }}>Normal Sinus</span>
            </div>

            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)", textTransform: "uppercase", fontWeight: 700 }}>Oxygen SpO2</span>
              <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{patient?.vitals?.spo2}</p>
              <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>Optimal Room Air</span>
            </div>

            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)", textTransform: "uppercase", fontWeight: 700 }}>Fasting Glucose</span>
              <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{patient?.vitals?.glucose}</p>
              <span style={{ fontSize: "11px", color: "var(--muted, #64748B)" }}>mg/dL</span>
            </div>
          </div>
        </div>

        {/* Card 3: Allergies & Emergency Contact */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "8px", borderRadius: "10px" }}>
              <ShieldAlert size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
              Known Drug & Food Allergies
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {(patient?.knownAllergies || []).map((a, idx) => (
              <div
                key={idx}
                style={{
                  background: a.severity === "Severe" ? "#FEF2F2" : "#FFFBEB",
                  border: a.severity === "Severe" ? "1px solid #FECACA" : "1px solid #FDE68A",
                  borderRadius: "8px",
                  padding: "8px 12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: a.severity === "Severe" ? "#991B1B" : "#92400E", fontSize: "13px" }}>
                    {a.allergen}
                  </strong>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: a.severity === "Severe" ? "#DC2626" : "#D97706" }}>
                    {a.severity}
                  </span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted, #64748B)" }}>{a.reaction}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border, #F1F5F9)", paddingTop: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Phone size={15} color="var(--blue, #0B4F8A)" />
              <strong style={{ fontSize: "13px", color: "var(--text, #0F172A)" }}>Emergency Contact</strong>
            </div>
            <p style={{ margin: "0 0 2px 0", fontSize: "13px", color: "var(--text, #334155)" }}>
              {patient?.emergencyContact?.name} ({patient?.emergencyContact?.relationship})
            </p>
            <span style={{ fontSize: "12px", color: "var(--blue, #0B4F8A)", fontWeight: 600 }}>
              {patient?.emergencyContact?.phone}
            </span>
          </div>
        </div>

        {/* Card 4: Medical History & Chronic Conditions */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ background: "var(--color-subtle-bg, #FAF5FF)", color: "#7E22CE", padding: "8px", borderRadius: "10px" }}>
              <FileText size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
              Medical History & Diagnoses
            </h3>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted, #64748B)", textTransform: "uppercase" }}>Active Chronic Conditions</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
              {(patient?.chronicConditions || []).map((c, i) => (
                <span
                  key={i}
                  style={{
                    background: "var(--light-blue, #EFF6FF)",
                    color: "var(--blue, #1E40AF)",
                    border: "1px solid var(--border, #BFDBFE)",
                    borderRadius: "20px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 600
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted, #64748B)", textTransform: "uppercase" }}>Clinical Narrative</span>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "var(--text, #334155)", lineHeight: 1.6, background: "var(--color-subtle-bg, #F8FAFC)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border, #E2E8F0)" }}>
              {patient?.medicalHistory}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
