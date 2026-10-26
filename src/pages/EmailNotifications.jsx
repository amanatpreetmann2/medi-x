import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server
} from "lucide-react";
import {
  getAllPatients,
  getEmailRecipients,
  getEmailLogs,
  getPatientById
} from "../utils/hospitalStore";
import {
  NOTIFICATION_TYPES,
  generateEmailContent,
  sendEmailNotification
} from "../utils/emailService";
import PageHeader from "../components/PageHeader";

export default function EmailNotifications({ user, showToast }) {
  const patients = getAllPatients();
  const [selectedPatientId, setSelectedPatientId] = useState(
    user?.patientId || user?.id || patients[0]?.id || 'MX-1001'
  );
  const selectedPatient = getPatientById(selectedPatientId) || patients[0];

  const [recipients] = useState(getEmailRecipients());
  const [selectedRecipientId, setSelectedRecipientId] = useState(recipients[0]?.id || 'rec_evaluator');
  const selectedRecipient = recipients.find(r => r.id === selectedRecipientId) || recipients[0];

  const [notificationType, setNotificationType] = useState('appointment_confirmation');
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [emailLogs, setEmailLogs] = useState(getEmailLogs());

  // SMTP backend server connection state
  const [serverStatus, setServerStatus] = useState({ online: false, smtpConfigured: false, checked: false });

  // Check backend server status
  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => {
        setServerStatus({ online: true, smtpConfigured: data.smtpConfigured, checked: true });
      })
      .catch(() => {
        setServerStatus({ online: false, smtpConfigured: false, checked: true });
      });
  }, []);

  const activeRecipient = isCustomRecipient
    ? { id: 'custom', name: customName || 'Custom Recipient', email: customEmail }
    : selectedRecipient;

  // Generate real-time preview
  const previewData = generateEmailContent({
    type: notificationType,
    patient: selectedPatient,
    recipient: activeRecipient
  });

  const handleSendEmail = async () => {
    if (isCustomRecipient && !customEmail) {
      alert('Please enter a valid recipient email address.');
      return;
    }

    setIsSending(true);
    setDeliveryResult(null);

    const result = await sendEmailNotification({
      type: notificationType,
      patient: selectedPatient,
      recipient: activeRecipient,
      customRecipientEmail: isCustomRecipient ? customEmail : null
    });

    setIsSending(false);
    setDeliveryResult(result);
    setEmailLogs(getEmailLogs());

    if (result.success) {
      if (showToast) showToast(result.message, 'success');
    }
  };

  return (
    <main className="content">
      {/* HEADER */}
      <PageHeader
        badge="Hospital Email Notification Engine"
        badgeIcon={Mail}
        title="Email Notifications Hub"
        subtitle="Configure recipients, preview hospital-branded templates, and dispatch test notifications for evaluation."
        actions={
          /* Backend Status Badge */
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: serverStatus.online
                ? (serverStatus.smtpConfigured ? "#ECFDF5" : "#EFF6FF")
                : "#F8FAFC",
              border: `1px solid ${serverStatus.online ? (serverStatus.smtpConfigured ? "#A7F3D0" : "#BFDBFE") : "#E2E8F0"}`,
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "12px"
            }}
          >
            <Server size={16} color={serverStatus.online ? "#10B981" : "#64748B"} />
            <div>
              <span style={{ fontWeight: 700, display: "block", color: serverStatus.online ? "#065F46" : "#334155" }}>
                {serverStatus.online
                  ? (serverStatus.smtpConfigured ? "Live SMTP Server: Online" : "Server: Online (Evaluation Demo Mode)")
                  : "Evaluation Demo Mode (Audited Log)"}
              </span>
              <span style={{ fontSize: "11px", color: "#64748B" }}>
                {serverStatus.smtpConfigured
                  ? "Delivering real emails via Nodemailer"
                  : "Emails securely recorded in persistent outbox"}
              </span>
            </div>
          </div>
        }
      />

      {/* DELIVERY FEEDBACK BANNER */}
      {deliveryResult && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            background: deliveryResult.success ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${deliveryResult.success ? "#86EFAC" : "#FECACA"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {deliveryResult.success ? (
              <CheckCircle2 size={22} color="#16A34A" />
            ) : (
              <AlertCircle size={22} color="#DC2626" />
            )}
            <div>
              <strong style={{ display: "block", color: deliveryResult.success ? "#166534" : "#991B1B", fontSize: "14px" }}>
                {deliveryResult.success ? "Notification Dispatched Successfully!" : "Delivery Failed"}
              </strong>
              <span style={{ fontSize: "13px", color: deliveryResult.success ? "#15803D" : "#B91C1C" }}>
                {deliveryResult.message}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeliveryResult(null)}
            style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKBENCH: CONTROLS (LEFT) & LIVE PREVIEW (RIGHT) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* LEFT COLUMN: DISPATCH CONTROLS */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          <h2 style={{ margin: "0 0 16px 0", fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
            1. Select Notification Parameters
          </h2>

          {/* 1. Select Patient */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "6px" }}>
              Target Demo Patient *
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {patients.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPatientId(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: selectedPatientId === p.id ? "2px solid var(--blue, #0B4F8A)" : "1px solid var(--border, #E2E8F0)",
                    background: selectedPatientId === p.id ? "var(--light-blue, #EFF6FF)" : "var(--color-card-bg, #FFFFFF)",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--text, #0F172A)" }}>{p.name}</strong>
                    <span style={{ fontSize: "11px", color: "var(--muted, #64748B)" }}>ID: {p.id} • {p.bloodGroup} • {p.email}</span>
                  </div>
                  {selectedPatientId === p.id && <CheckCircle2 size={16} color="var(--blue, #0B4F8A)" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Select Notification Type */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)", marginBottom: "6px" }}>
              Notification Type *
            </label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)", fontWeight: 600 }}
            >
              {NOTIFICATION_TYPES.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--muted, #64748B)", fontStyle: "italic" }}>
              {NOTIFICATION_TYPES.find(t => t.id === notificationType)?.description}
            </p>
          </div>

          {/* 3. Select Configured Recipient */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text, #334155)" }}>
                Configured Recipient *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomRecipient(!isCustomRecipient)}
                style={{ background: "none", border: "none", color: "var(--blue, #0B4F8A)", fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                {isCustomRecipient ? "Choose from Configured List" : "+ Enter Custom Email"}
              </button>
            </div>

            {isCustomRecipient ? (
              <div style={{ background: "var(--color-subtle-bg, #F8FAFC)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border, #E2E8F0)" }}>
                <div style={{ marginBottom: "8px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text, #475569)", marginBottom: "3px" }}>Recipient Email</label>
                  <input
                    type="email"
                    placeholder="e.g. professor@college.edu"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text, #475569)", marginBottom: "3px" }}>Recipient Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Evaluator"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border, #CBD5E1)", fontSize: "13px", boxSizing: "border-box", background: "var(--color-card-bg, #FFFFFF)", color: "var(--text, #0F172A)" }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {recipients.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRecipientId(r.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: selectedRecipientId === r.id ? "2px solid var(--teal, #00A896)" : "1px solid var(--border, #E2E8F0)",
                      background: selectedRecipientId === r.id ? "rgba(0, 168, 150, 0.1)" : "var(--color-card-bg, #FFFFFF)",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "var(--text, #0F172A)" }}>{r.name}</strong>
                      <span style={{ fontSize: "11px", color: "var(--muted, #64748B)" }}>{r.email} ({r.role})</span>
                    </div>
                    {selectedRecipientId === r.id && <CheckCircle2 size={16} color="var(--teal, #00A896)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={isSending}
            onClick={handleSendEmail}
            style={{
              width: "100%",
              padding: "13px 20px",
              background: isSending ? "#94A3B8" : "linear-gradient(135deg, #0B4F8A 0%, #0070BA 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: isSending ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 4px 15px rgba(11, 79, 138, 0.25)"
            }}
          >
            {isSending ? (
              <span>Dispatching Notification...</span>
            ) : (
              <>
                <Send size={18} />
                Send Notification to {activeRecipient.email}
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: LIVE HTML TEMPLATE PREVIEW */}
        <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid var(--border, #F1F5F9)", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Eye size={18} color="var(--blue, #0B4F8A)" />
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
                Live Email Template Preview
              </h2>
            </div>
            <span style={{ fontSize: "11px", background: "var(--light-blue, #EFF6FF)", color: "var(--blue, #1E40AF)", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
              Hospital Formatted
            </span>
          </div>

          <div style={{ marginBottom: "12px", background: "var(--color-subtle-bg, #F8FAFC)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border, #E2E8F0)", fontSize: "12px", color: "var(--text, #334155)" }}>
            <p style={{ margin: "0 0 4px 0" }}><strong>To:</strong> {activeRecipient.name} &lt;{activeRecipient.email}&gt;</p>
            <p style={{ margin: "0 0 4px 0" }}><strong>Subject:</strong> {previewData.subject}</p>
            <p style={{ margin: 0 }}><strong>Patient ID:</strong> {selectedPatient.id} ({selectedPatient.name})</p>
          </div>

          {/* Render preview inside styled container */}
          <div
            style={{
              flex: 1,
              border: "1px solid var(--border, #CBD5E1)",
              borderRadius: "12px",
              overflow: "auto",
              maxHeight: "440px",
              background: "var(--color-subtle-bg, #F1F5F9)",
              padding: "16px"
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: previewData.html }}
              style={{ transform: "scale(0.92)", transformOrigin: "top center" }}
            />
          </div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div style={{ background: "var(--color-card-bg, #FFFFFF)", border: "1px solid var(--border, #E2E8F0)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={18} color="var(--blue, #0B4F8A)" />
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #0F172A)" }}>
              Email Delivery Audit Log ({emailLogs.length})
            </h2>
          </div>
          <span style={{ fontSize: "12px", color: "var(--muted, #64748B)" }}>
            Persistent delivery history recorded for evaluation audit
          </span>
        </div>

        {emailLogs.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted, #64748B)", background: "var(--color-subtle-bg, #F8FAFC)", borderRadius: "10px" }}>
            <p style={{ margin: 0 }}>No emails have been sent yet in this session. Dispatch a test notification above!</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--color-subtle-bg, #F8FAFC)", textAlign: "left", color: "var(--muted, #64748B)", borderBottom: "2px solid var(--border, #E2E8F0)" }}>
                  <th style={{ padding: "10px 14px" }}>Timestamp</th>
                  <th style={{ padding: "10px 14px" }}>Log ID</th>
                  <th style={{ padding: "10px 14px" }}>Patient</th>
                  <th style={{ padding: "10px 14px" }}>Recipient</th>
                  <th style={{ padding: "10px 14px" }}>Notification Type</th>
                  <th style={{ padding: "10px 14px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border, #F1F5F9)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--muted, #64748B)" }}>{log.displayDate || new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--blue, #0B4F8A)" }}>{log.id}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text, #0F172A)" }}>{log.patientName} ({log.patientId})</td>
                    <td style={{ padding: "10px 14px", color: "var(--text, #334155)" }}>{log.recipient}</td>
                    <td style={{ padding: "10px 14px", color: "var(--muted, #64748B)", textTransform: "capitalize" }}>{log.notificationType?.replace('_', ' ')}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
