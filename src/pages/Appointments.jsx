import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  X,
  CalendarCheck,
  CalendarX,
  CalendarDays,
  AlertCircle
} from "lucide-react";
import {
  getPatientById,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment
} from "../utils/hospitalStore";
import { sendEmailNotification } from "../utils/emailService";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllAppointments,
  addAppointment as addApptAction,
  rescheduleAppointment as rescheduleApptAction,
  cancelAppointment as cancelApptAction,
  loadPatientAppointments
} from "../store/slices/appointmentsSlice";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Appointments({ user: propUser, showToast: propShowToast }) {
  const { user: authUser } = useAuth();
  const { showToast: contextShowToast } = useToast();
  const user = propUser || authUser;
  const showToast = propShowToast || contextShowToast;

  const dispatch = useDispatch();
  const appointments = useSelector(selectAllAppointments);

  const patientId = user?.patientId || user?.id || 'MX-1001';
  const patient = getPatientById(patientId);

  const [tab, setTab] = useState("Upcoming");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState(null);
  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Reschedule form state
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");

  // Booking form state
  const [bookDoctor, setBookDoctor] = useState("Dr. Sarah Jenkins");
  const [bookSpecialty, setBookSpecialty] = useState("Cardiology");
  const [bookDate, setBookDate] = useState(() => new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [bookTime, setBookTime] = useState("10:30 AM");
  const [bookDepartment, setBookDepartment] = useState("Cardiovascular Care Center - Suite 4B");
  const [bookReason, setBookReason] = useState("");
  const [sendEmailPrompt, setSendEmailPrompt] = useState(true);

  // Sync Redux state whenever patientId changes
  useEffect(() => {
    dispatch(loadPatientAppointments(patientId));
  }, [patientId, dispatch]);

  const notify = (msg) => {
    setToastMessage(msg);
    if (showToast) showToast(msg, 'success');
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filter Upcoming vs Past/Cancelled from Redux store
  const upcomingList = appointments.filter(a => a.status === 'Upcoming');
  const pastList = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  // Handle Reschedule via Redux Dispatch
  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!newDate) return;

    dispatch(rescheduleApptAction({
      patientId,
      appointmentId: rescheduleModalAppt.id,
      newDate,
      newTime
    }));

    setRescheduleModalAppt(null);
    notify(`✓ Appointment rescheduled to ${newDate} at ${newTime}`);

    if (sendEmailPrompt) {
      sendEmailNotification({
        type: 'appointment_confirmation',
        patient,
        appointment: { ...rescheduleModalAppt, date: newDate, time: newTime },
        recipient: { name: patient.name, email: patient.email }
      });
    }
  };

  // Handle Cancel via Redux Dispatch
  const handleConfirmCancel = () => {
    if (!cancelModalAppt) return;
    dispatch(cancelApptAction({
      patientId,
      appointmentId: cancelModalAppt.id
    }));
    setCancelModalAppt(null);
    notify(`Appointment ${cancelModalAppt.id} was successfully cancelled.`);
  };

  // Handle Booking via Redux Dispatch
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookDoctor || !bookDate) return;

    const appointmentData = {
      doctor: bookDoctor,
      specialty: bookSpecialty,
      date: bookDate,
      time: bookTime,
      department: bookDepartment,
      reason: bookReason || 'Routine Clinical Consultation'
    };

    dispatch(addApptAction({
      patientId,
      appointmentData
    }));

    setIsBookModalOpen(false);
    setBookReason("");
    notify(`✓ Appointment booked with ${bookDoctor} on ${bookDate}`);

    if (sendEmailPrompt) {
      sendEmailNotification({
        type: 'appointment_confirmation',
        patient,
        appointment: appointmentData,
        recipient: { name: patient.name, email: patient.email }
      });
    }
  };

  return (
    <main className="content">
      {/* Toast Notification */}
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

      {/* UNIFIED PAGE HEADER */}
      <PageHeader
        badge="Patient Scheduling System"
        badgeIcon={CalendarDays}
        title="My Appointments"
        subtitle={<>Consultations, diagnostic visits, and clinical reviews for <strong>{patient?.name}</strong>.</>}
        actions={
          <button
            type="button"
            onClick={() => setIsBookModalOpen(true)}
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
            Book Appointment
          </button>
        }
      />

      {/* TABS: UPCOMING & PAST (Unified Divider Spacing) */}
      <div className="medix-tabs-divider">
        <button
          type="button"
          onClick={() => setTab("Upcoming")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: tab === "Upcoming" ? "#0B4F8A" : "var(--color-subtle-bg, #F1F5F9)",
            color: tab === "Upcoming" ? "#FFFFFF" : "var(--muted, #475569)",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <CalendarCheck size={16} />
          Upcoming Visits ({upcomingList.length})
        </button>

        <button
          type="button"
          onClick={() => setTab("Past")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: tab === "Past" ? "#0B4F8A" : "var(--color-subtle-bg, #F1F5F9)",
            color: tab === "Past" ? "#FFFFFF" : "var(--muted, #475569)",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Clock size={16} />
          Past & History ({pastList.length})
        </button>
      </div>

      {/* APPOINTMENTS LIST */}
      {tab === "Upcoming" ? (
        upcomingList.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--color-card-bg, #FFFFFF)", borderRadius: "16px", border: "1px dashed var(--border, #CBD5E1)", color: "var(--muted, #64748B)" }}>
            <Calendar size={32} style={{ display: "block", margin: "0 auto 10px auto", opacity: 0.5 }} />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--text, #0F172A)" }}>No Upcoming Appointments</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--muted, #64748B)" }}>You do not have any upcoming visits scheduled currently.</p>
            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              style={{ padding: "8px 16px", background: "#0B4F8A", color: "#FFFFFF", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
            {upcomingList.map(appt => (
              <div
                key={appt.id}
                style={{
                  background: "var(--color-card-bg, #FFFFFF)",
                  border: "1.5px solid var(--border, #E2E8F0)",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ background: "var(--light-blue, #EFF6FF)", border: "1.5px solid var(--border, #BFDBFE)", borderRadius: "10px", padding: "6px 12px", textAlign: "center" }}>
                        <span style={{ display: "block", fontSize: "10px", fontWeight: 800, color: "var(--blue, #1E40AF)" }}>{appt.month}</span>
                        <span style={{ display: "block", fontSize: "18px", fontWeight: 800, color: "var(--blue-dark, #0B4F8A)" }}>{appt.day}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--teal, #00A896)" }}>{appt.id}</span>
                        <h3 style={{ margin: "2px 0", fontSize: "1.05rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{appt.doctor}</h3>
                        <span style={{ fontSize: "12px", color: "var(--muted, #64748B)" }}>{appt.specialty}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "#DCFCE7", color: "#166534" }}>
                      UPCOMING
                    </span>
                  </div>

                  <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "10px", padding: "10px 12px", margin: "10px 0", fontSize: "12px", color: "var(--text, #475569)" }}>
                    <p style={{ margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "6px", color: "var(--text, #334155)" }}>
                      <Clock size={14} color="var(--blue, #0B4F8A)" /> <strong>Time:</strong> {appt.time}
                    </p>
                    <p style={{ margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "6px", color: "var(--text, #334155)" }}>
                      <MapPin size={14} color="var(--blue, #0B4F8A)" /> <strong>Location:</strong> {appt.department}
                    </p>
                    <p style={{ margin: 0, color: "var(--text, #334155)" }}>
                      <strong>Reason:</strong> {appt.reason}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px solid var(--border, #F1F5F9)", paddingTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedAppt(appt)}
                    style={{ flex: 1, padding: "8px 10px", background: "var(--color-subtle-bg, #F1F5F9)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text, #334155)", cursor: "pointer" }}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRescheduleModalAppt(appt);
                      setNewDate(appt.date);
                      setNewTime(appt.time);
                    }}
                    style={{ flex: 1, padding: "8px 10px", background: "var(--light-blue, #EFF6FF)", border: "1px solid var(--border, #BFDBFE)", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "var(--blue, #0B4F8A)", cursor: "pointer" }}
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelModalAppt(appt)}
                    style={{ padding: "8px 10px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#DC2626", cursor: "pointer" }}
                    title="Cancel Appointment"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        pastList.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--color-card-bg, #FFFFFF)", borderRadius: "16px", border: "1px dashed var(--border, #CBD5E1)", color: "var(--muted, #64748B)" }}>
            <p>No past medical appointment records found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
            {pastList.map(appt => (
              <div
                key={appt.id}
                style={{
                  background: "var(--color-card-bg, #FFFFFF)",
                  border: "1px solid var(--border, #E2E8F0)",
                  borderRadius: "16px",
                  padding: "18px",
                  opacity: appt.status === 'Cancelled' ? 0.75 : 1
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted, #64748B)" }}>{appt.id}</span>
                    <h3 style={{ margin: "2px 0", fontSize: "1rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{appt.doctor}</h3>
                    <span style={{ fontSize: "12px", color: "var(--muted, #64748B)" }}>{appt.specialty}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: appt.status === 'Cancelled' ? '#FEE2E2' : 'var(--color-subtle-bg, #F1F5F9)',
                      color: appt.status === 'Cancelled' ? '#991B1B' : 'var(--muted, #475569)'
                    }}
                  >
                    {appt.status.toUpperCase()}
                  </span>
                </div>

                <p style={{ margin: "6px 0", fontSize: "12px", color: "var(--muted, #64748B)" }}>
                  <strong>Date:</strong> {appt.date} at {appt.time}
                </p>
                <p style={{ margin: "4px 0", fontSize: "12px", color: "var(--text, #334155)" }}>
                  <strong>Reason:</strong> {appt.reason}
                </p>
                {appt.notes && (
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--muted, #64748B)", fontStyle: "italic" }}>
                    Notes: {appt.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppt && (
        <div className="modal-backdrop" onClick={() => setSelectedAppt(null)} style={{ position: "fixed", inset: 0, background: "rgba(15, 30, 50, 0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "18px", width: "100%", maxWidth: "480px", padding: "26px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setSelectedAppt(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--muted, #64748B)" }}>
              <X size={20} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "var(--light-blue, #EFF6FF)", padding: "12px", borderRadius: "12px", color: "var(--blue, #0B4F8A)" }}>
                <Calendar size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>{selectedAppt.doctor}</h3>
                <span style={{ fontSize: "12px", color: "var(--teal, #00A896)", fontWeight: 700 }}>{selectedAppt.specialty} • {selectedAppt.id}</span>
              </div>
            </div>

            <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "12px", padding: "16px", marginBottom: "18px", border: "1px solid var(--border, #E2E8F0)", fontSize: "13px", color: "var(--text, #334155)" }}>
              <p style={{ margin: "0 0 8px 0" }}><strong>Scheduled Date:</strong> {selectedAppt.date} at {selectedAppt.time}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Clinic Department:</strong> {selectedAppt.department}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Reason for Visit:</strong> {selectedAppt.reason}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Clinical Notes:</strong> <span style={{ fontStyle: "italic", color: "var(--muted, #64748B)" }}>{selectedAppt.notes || 'None recorded'}</span></p>
              <p style={{ margin: 0 }}><strong>Patient:</strong> {patient?.name} (ID: {patient?.id})</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setSelectedAppt(null)} style={{ padding: "8px 18px", background: "#0B4F8A", color: "#FFFFFF", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModalAppt && (
        <div className="modal-backdrop" onClick={() => setRescheduleModalAppt(null)} style={{ position: "fixed", inset: 0, background: "rgba(15, 30, 50, 0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "18px", width: "100%", maxWidth: "440px", padding: "26px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setRescheduleModalAppt(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--muted, #64748B)" }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>Reschedule Appointment</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted, #64748B)" }}>With {rescheduleModalAppt.doctor} ({rescheduleModalAppt.id})</p>

            <form onSubmit={handleConfirmReschedule} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>New Date *</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>New Time *</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setRescheduleModalAppt(null)} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", background: "var(--color-subtle-bg, #FFFFFF)", color: "var(--text, #475569)", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#0B4F8A", color: "#FFFFFF", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModalAppt && (
        <div className="modal-backdrop" onClick={() => setCancelModalAppt(null)} style={{ position: "fixed", inset: 0, background: "rgba(15, 30, 50, 0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "18px", width: "100%", maxWidth: "420px", padding: "26px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <CalendarX size={26} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>Cancel Appointment?</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--muted, #64748B)" }}>
                Are you sure you want to cancel your visit with <strong>{cancelModalAppt.doctor}</strong> on {cancelModalAppt.date}?
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => setCancelModalAppt(null)} style={{ flex: 1, padding: "9px 14px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", background: "var(--color-subtle-bg, #FFFFFF)", color: "var(--text, #475569)", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                Keep Appointment
              </button>
              <button type="button" onClick={handleConfirmCancel} style={{ flex: 1, padding: "9px 14px", borderRadius: "8px", border: "none", background: "#DC2626", color: "#FFFFFF", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK NEW APPOINTMENT MODAL */}
      {isBookModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBookModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15, 30, 50, 0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "18px", width: "100%", maxWidth: "480px", padding: "26px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setIsBookModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--muted, #64748B)" }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>Book Medical Appointment</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted, #64748B)" }}>Scheduling visit for Patient <strong>{patient?.name}</strong> (ID: {patient?.id})</p>

            <form onSubmit={handleConfirmBooking} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Select Doctor *</label>
                <select
                  value={bookDoctor}
                  onChange={(e) => {
                    const doc = e.target.value;
                    setBookDoctor(doc);
                    if (doc.includes("Sarah")) {
                      setBookSpecialty("Cardiology");
                      setBookDepartment("Cardiovascular Care Center - Suite 4B");
                    } else if (doc.includes("Alan")) {
                      setBookSpecialty("Endocrinology");
                      setBookDepartment("Diabetes & Metabolism Center - Room 104");
                    } else if (doc.includes("Emily")) {
                      setBookSpecialty("Orthopedics");
                      setBookDepartment("Joint & Sports Pavilion West");
                    } else {
                      setBookSpecialty("General Practice");
                      setBookDepartment("Ambulatory Primary Care");
                    }
                  }}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                >
                  <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                  <option value="Dr. Alan Smith">Dr. Alan Smith (Endocrinology)</option>
                  <option value="Dr. Emily Smith">Dr. Emily Smith (Orthopedics & Sports Med)</option>
                  <option value="Dr. Kevin Reed">Dr. Kevin Reed (Pulmonology)</option>
                  <option value="Dr. Mark Davis">Dr. Mark Davis (General Practice)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookDate(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Time *</label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:45 AM">11:45 AM</option>
                    <option value="02:15 PM">02:15 PM</option>
                    <option value="03:45 PM">03:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "4px" }}>Reason for Consultation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood pressure review, medication adjustment"
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="email-notif-check"
                  checked={sendEmailPrompt}
                  onChange={(e) => setSendEmailPrompt(e.target.checked)}
                />
                <label htmlFor="email-notif-check" style={{ fontSize: "12px", color: "var(--text, #475569)", cursor: "pointer" }}>
                  Send confirmation email notification to configured recipient
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setIsBookModalOpen(false)} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid var(--border, #CBD5E1)", background: "var(--color-subtle-bg, #FFFFFF)", color: "var(--text, #475569)", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#0B4F8A", color: "#FFFFFF", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}