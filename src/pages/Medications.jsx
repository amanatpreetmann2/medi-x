import React, { useState } from "react";
import {
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  Info,
  Calendar,
  FileText,
  X,
  Pill,
  CheckCircle2
} from "lucide-react";
import {
  toggleMedicationDose,
  addMedication,
  getPatientById
} from "../utils/hospitalStore";
import PageHeader from "../components/PageHeader";

export default function Medications({ user, showToast }) {
  // Active patient data based on logged in user
  const patientId = user?.patientId || user?.id || 'MX-1001';
  const patient = getPatientById(patientId);

  // Date navigation state
  const [selectedDateOffset, setSelectedDateOffset] = useState(0); // 0 = Today, -1 = Yesterday, +1 = Tomorrow
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form for adding custom demo medicine
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedPeriod, setNewMedPeriod] = useState("Morning");
  const [newMedTime, setNewMedTime] = useState("8:00 AM");
  const [newMedInstructions, setNewMedInstructions] = useState("");
  const [newMedDoctor, setNewMedDoctor] = useState("Dr. Sarah Jenkins");

  // Local state for instant UI responsiveness, backed by hospitalStore
  const [medList, setMedList] = useState(patient?.medications || []);

  // Update medList whenever patient changes
  React.useEffect(() => {
    const updated = getPatientById(patientId);
    setMedList(updated?.medications || []);
  }, [patientId]);

  // Compute display date
  const displayDate = new Date();
  displayDate.setDate(displayDate.getDate() + selectedDateOffset);
  const dateFormatted = displayDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const isToday = selectedDateOffset === 0;

  // Toggle dose taken
  const handleToggleDose = (med) => {
    const nextState = !med.taken;
    const updated = toggleMedicationDose(patientId, med.id, nextState);
    if (updated) {
      setMedList(prev => prev.map(m => m.id === med.id ? updated : m));
      const msg = nextState
        ? `✓ Dose confirmed: ${med.name} marked as TAKEN`
        : `Dose updated: ${med.name} marked as PENDING`;
      setToastMessage(msg);
      if (showToast) showToast(msg, 'success');
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  // Add Medication
  const handleAddMedicationSubmit = (e) => {
    e.preventDefault();
    if (!newMedName) return;

    const newMed = {
      name: newMedName,
      dosage: newMedDose || '1 tablet',
      period: newMedPeriod,
      time: newMedTime,
      instructions: newMedInstructions || 'Take with water',
      doctor: newMedDoctor,
      specialty: 'Clinical Medicine',
      startDate: new Date().toISOString().split('T')[0],
      endDate: 'Ongoing',
      refillsRemaining: 3,
      purpose: 'Therapeutic Prescription'
    };

    const added = addMedication(patientId, newMed);
    if (added) {
      setMedList(prev => [...prev, added]);
      setIsAddModalOpen(false);
      setNewMedName("");
      setNewMedDose("");
      setNewMedInstructions("");
      const msg = `Prescription added: ${newMed.name} scheduled for ${newMed.period}`;
      setToastMessage(msg);
      if (showToast) showToast(msg, 'success');
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  // Medication Counts & Progress
  const totalDoses = medList.length;
  const takenDoses = medList.filter(m => m.taken).length;
  const progressPercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  // Identify next upcoming dose
  const nextPendingMed = medList.find(m => !m.taken);

  // Group medications by time periods
  const periodConfigs = [
    {
      period: "Morning",
      timeRange: "6:00 AM - 11:59 AM",
      icon: <Sun size={20} color="#EAB308" />,
      bgBadge: "#FEF9C3",
      textColor: "#854D0E"
    },
    {
      period: "Afternoon",
      timeRange: "12:00 PM - 4:59 PM",
      icon: <Sparkles size={20} color="#00A896" />,
      bgBadge: "#CCFBF1",
      textColor: "#115E59"
    },
    {
      period: "Evening",
      timeRange: "5:00 PM - 8:59 PM",
      icon: <Sunset size={20} color="#F97316" />,
      bgBadge: "#FFEDD5",
      textColor: "#9A3412"
    },
    {
      period: "Night",
      timeRange: "9:00 PM - 5:59 AM",
      icon: <Moon size={20} color="#6366F1" />,
      bgBadge: "#E0E7FF",
      textColor: "#3730A3"
    }
  ];

  return (
    <main className="content">
      {/* Toast alert */}
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

      {/* HEADER & ACTIONS */}
      <PageHeader
        badge="Daily Medication Schedule"
        badgeIcon={Pill}
        title="My Medicines"
        subtitle={
          <>
            Prescriptions and scheduled doses for <strong>{patient?.name}</strong> (ID: {patient?.id}).
          </>
        }
        actions={
          <button
            className="add-medication-btn"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #0B4F8A 0%, #0070BA 100%)",
              color: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(11, 79, 138, 0.25)"
            }}
          >
            <Plus size={18} />
            Add Prescription
          </button>
        }
      />

      {/* SUMMARY DASHBOARD: PROGRESS & NEXT DOSE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          margin: "20px 0 26px 0"
        }}
      >
        {/* Progress Card */}
        <div
          style={{
            background: "var(--color-card-bg, #FFFFFF)",
            border: "1px solid var(--border, #E2E8F0)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted, #64748B)", textTransform: "uppercase" }}>
                Today's Adherence
              </span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                {takenDoses} of {totalDoses} Doses Taken
              </h3>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: progressPercent === 100 ? "#DCFCE7" : "var(--light-blue, #EFF6FF)",
                color: progressPercent === 100 ? "#15803D" : "var(--blue, #0B4F8A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "14px"
              }}
            >
              {progressPercent}%
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: "100%", height: "9px", background: "var(--color-subtle-bg, #F1F5F9)", borderRadius: "10px", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: progressPercent === 100 ? "#10B981" : "linear-gradient(90deg, #0B4F8A, #00A896)",
                borderRadius: "10px",
                transition: "width 0.4s ease"
              }}
            />
          </div>

          <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--muted, #64748B)", display: "flex", justifyContent: "space-between" }}>
            <span>{isToday ? "Daily Schedule Active" : "Reviewing History"}</span>
            <span style={{ fontWeight: 600, color: progressPercent === 100 ? "#10B981" : "var(--blue, #0B4F8A)" }}>
              {progressPercent === 100 ? "All doses complete! ✓" : `${totalDoses - takenDoses} pending`}
            </span>
          </div>
        </div>

        {/* Next Scheduled Dose Highlight Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B4F8A 0%, #123B5D 100%)",
            color: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(11, 79, 138, 0.2)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#93C5FD", textTransform: "uppercase" }}>
            <Clock size={14} /> Next Scheduled Dose
          </div>

          {nextPendingMed ? (
            <div style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 2px 0", fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>
                    {nextPendingMed.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#E0F2FE" }}>
                    {nextPendingMed.dosage} • {nextPendingMed.period} ({nextPendingMed.time})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleDose(nextPendingMed)}
                  style={{
                    background: "#00A896",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Check size={14} /> Take Dose
                </button>
              </div>
              <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
                "{nextPendingMed.instructions}"
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "12px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem", color: "#A7F3D0" }}>
                All Doses Completed!
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>
                You have marked all scheduled medicines as taken for this date.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DATE SWITCHER BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--color-card-bg, #FFFFFF)",
          border: "1px solid var(--border, #E2E8F0)",
          borderRadius: "14px",
          padding: "12px 18px",
          marginBottom: "28px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setSelectedDateOffset(prev => prev - 1)}
            style={{
              background: "var(--color-subtle-bg, #F1F5F9)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "var(--text, #0F172A)"
            }}
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => setSelectedDateOffset(0)}
            style={{
              background: isToday ? "#0B4F8A" : "var(--color-subtle-bg, #F8FAFC)",
              color: isToday ? "#FFFFFF" : "var(--text, #334155)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "8px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setSelectedDateOffset(prev => prev + 1)}
            style={{
              background: "var(--color-subtle-bg, #F1F5F9)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "var(--text, #0F172A)"
            }}
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", fontWeight: 700, color: "var(--text, #0F172A)" }}>
          <Calendar size={18} color="var(--blue, #0B4F8A)" />
          <span>{dateFormatted}</span>
          {isToday && (
            <span style={{ fontSize: "11px", background: "#DCFCE7", color: "#166534", padding: "2px 8px", borderRadius: "12px", fontWeight: 700 }}>
              Current Day
            </span>
          )}
        </div>
      </div>

      {/* 4 SCHEDULE SECTIONS: MORNING, AFTERNOON, EVENING, NIGHT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {periodConfigs.map(cfg => {
          const medsInSlot = medList.filter(m => m.period.toLowerCase() === cfg.period.toLowerCase());

          return (
            <section
              key={cfg.period}
              style={{
                background: "var(--color-card-bg, #FFFFFF)",
                border: "1px solid var(--border, #E2E8F0)",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.02)"
              }}
            >
              {/* Section Title Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "12px", borderBottom: "1px solid var(--border, #F1F5F9)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: "8px", borderRadius: "10px", background: cfg.bgBadge }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                      {cfg.period} Medicines
                    </h2>
                    <span style={{ fontSize: "12px", color: "var(--muted, #64748B)", fontWeight: 500 }}>
                      Scheduled window: {cfg.timeRange}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "12px", fontWeight: 700, color: cfg.textColor, background: cfg.bgBadge, padding: "4px 10px", borderRadius: "8px" }}>
                  {medsInSlot.length} Prescribed
                </div>
              </div>

              {/* Medicines List or Empty State */}
              {medsInSlot.length === 0 ? (
                <div
                  style={{
                    padding: "28px 16px",
                    textAlign: "center",
                    background: "var(--color-subtle-bg, #F8FAFC)",
                    borderRadius: "12px",
                    border: "1px dashed var(--border, #CBD5E1)",
                    color: "var(--muted, #64748B)"
                  }}
                >
                  <Info size={22} style={{ display: "block", margin: "0 auto 8px auto", opacity: 0.6 }} />
                  <p style={{ margin: "0 0 4px 0", fontWeight: 600, fontSize: "14px", color: "var(--text, #0F172A)" }}>
                    No medicines scheduled for the {cfg.period.toLowerCase()}.
                  </p>
                  <span style={{ fontSize: "12px", color: "var(--muted, #94A3B8)" }}>
                    Patient {patient?.name} does not have active prescriptions in this time window.
                  </span>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
                  {medsInSlot.map(med => (
                    <div
                      key={med.id}
                      style={{
                        border: med.taken ? "1.5px solid #10B981" : "1.5px solid var(--border, #E2E8F0)",
                        background: med.taken ? "rgba(16, 185, 129, 0.08)" : "var(--color-card-bg, #FFFFFF)",
                        borderRadius: "14px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div>
                        {/* Status badge & Rx number */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              background: med.taken ? "#DCFCE7" : "#FEF3C7",
                              color: med.taken ? "#166534" : "#92400E",
                              padding: "3px 8px",
                              borderRadius: "6px"
                            }}
                          >
                            {med.taken ? "TAKEN ✓" : "DUE"}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--muted, #94A3B8)", fontWeight: 600 }}>
                            {med.rxNumber || "RX-MEDIX"}
                          </span>
                        </div>

                        {/* Medicine Name & Dosage */}
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                          {med.name}
                        </h3>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.875rem", color: "var(--blue, #0B4F8A)", fontWeight: 700 }}>
                          Dosage: {med.dosage}
                        </p>

                        {/* Instructions */}
                        <div
                          style={{
                            background: "var(--color-subtle-bg, rgba(0,0,0,0.02))",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "var(--text, #475569)",
                            marginBottom: "12px",
                            border: "1px solid var(--border, transparent)"
                          }}
                        >
                          <strong>Directions:</strong> {med.instructions}
                        </div>

                        {/* Doctor and Scheduled Time */}
                        <div style={{ fontSize: "11px", color: "var(--muted, #64748B)", display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                          <span>Dr: <strong>{med.doctor}</strong></span>
                          <span>Time: <strong>{med.time}</strong></span>
                        </div>
                      </div>

                      {/* Action buttons: Mark Taken & Prescription Details */}
                      <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border, rgba(0,0,0,0.06))", paddingTop: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleDose(med)}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "none",
                            background: med.taken ? "#16A34A" : "#0B4F8A",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                        >
                          <Check size={14} />
                          {med.taken ? "Marked Taken" : "Mark as Taken"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPrescription(med)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--border, #E2E8F0)",
                            background: "var(--color-subtle-bg, #FFFFFF)",
                            color: "var(--text, #475569)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                          title="View Full Prescription Details"
                        >
                          <FileText size={14} />
                          Rx Details
                        </button>
                      </div>

                      {med.taken && med.takenTime && (
                        <div style={{ fontSize: "10px", color: "#166534", marginTop: "6px", textAlign: "center", fontWeight: 700 }}>
                          {med.takenTime}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* PRESCRIPTION DETAILS MODAL */}
      {selectedPrescription && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedPrescription(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 30, 50, 0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "var(--color-card-bg, #FFFFFF)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "460px",
              padding: "26px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPrescription(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted, #64748B)"
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "var(--light-blue, #EFF6FF)", padding: "10px", borderRadius: "12px", color: "var(--blue, #0B4F8A)" }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                  {selectedPrescription.name}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--teal, #00A896)", fontWeight: 700 }}>
                  Prescription #{selectedPrescription.rxNumber}
                </span>
              </div>
            </div>

            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "12px", padding: "16px", marginBottom: "18px", border: "1px solid var(--border, #E2E8F0)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                <div>
                  <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Dosage</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 700, color: "var(--text, #0F172A)" }}>{selectedPrescription.dosage}</p>
                </div>
                <div>
                  <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Frequency</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 700, color: "var(--text, #0F172A)" }}>{selectedPrescription.period} ({selectedPrescription.time})</p>
                </div>
                <div>
                  <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Prescribing Doctor</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 600, color: "var(--text, #0F172A)" }}>{selectedPrescription.doctor}</p>
                </div>
                <div>
                  <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Refills Remaining</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 700, color: "#16A34A" }}>{selectedPrescription.refillsRemaining ?? 3} Refills</p>
                </div>
              </div>

              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border, #E2E8F0)" }}>
                <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Clinical Instructions</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text, #334155)", fontStyle: "italic" }}>
                  "{selectedPrescription.instructions}"
                </p>
              </div>

              <div style={{ marginTop: "10px" }}>
                <span style={{ color: "var(--muted, #64748B)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Therapeutic Purpose</span>
                <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "var(--text, #0F172A)", fontWeight: 600 }}>
                  {selectedPrescription.purpose || "Prescribed Therapeutic Treatment"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0B4F8A",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Close Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEDICATION MODAL */}
      {isAddModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 30, 50, 0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "var(--color-card-bg, #FFFFFF)",
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "460px",
              padding: "26px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted, #64748B)"
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
              Add Prescription Dose
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.85rem", color: "var(--muted, #64748B)" }}>
              Prescription entry for {patient?.name}. Fictional demonstration data only.
            </p>

            <form onSubmit={handleAddMedicationSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine, Amoxicillin"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5mg, 500mg"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                    Schedule Period *
                  </label>
                  <select
                    value={newMedPeriod}
                    onChange={(e) => setNewMedPeriod(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                    Prescribing Doctor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={newMedDoctor}
                    onChange={(e) => setNewMedDoctor(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>
                  Clinical Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take with food, drink full glass of water"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", background: "var(--color-subtle-bg, #FFFFFF)", color: "var(--text, #475569)", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#0B4F8A", color: "#FFFFFF", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}