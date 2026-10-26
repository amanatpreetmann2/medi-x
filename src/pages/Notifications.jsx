import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Pill,
  FileText,
  Info,
  Check,
  Volume2
} from "lucide-react";
import {
  getPatientById,
  markNotificationRead,
  markAllNotificationsRead
} from "../utils/hospitalStore";
import PageHeader from "../components/PageHeader";

export default function Notifications({ user, showToast }) {
  const patientId = user?.patientId || user?.id || 'MX-1001';
  const patient = getPatientById(patientId);

  const [notifications, setNotifications] = useState(patient?.notifications || []);
  const [filter, setFilter] = useState("all");
  const [browserPermStatus, setBrowserPermStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  React.useEffect(() => {
    const p = getPatientById(patientId);
    setNotifications(p?.notifications || []);
  }, [patientId]);

  const handleMarkRead = (id) => {
    markNotificationRead(patientId, id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(patientId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (showToast) showToast('All notifications marked as read', 'success');
  };

  const handleRequestBrowserPerm = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }
    const perm = await Notification.requestPermission();
    setBrowserPermStatus(perm);
    if (perm === 'granted') {
      new Notification('Medix Healthcare Portal', {
        body: `Notifications active for Patient ${patient?.name || 'User'}`,
        icon: '/favicon.svg'
      });
      if (showToast) showToast('Browser notifications enabled successfully!', 'success');
    }
  };

  // Filter items
  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "appointment") return n.category === "appointment";
    if (filter === "medication") return n.category === "medication";
    if (filter === "report") return n.category === "report";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "appointment":
        return <Calendar size={18} color="#0B4F8A" />;
      case "medication":
        return <Pill size={18} color="#8B5CF6" />;
      case "report":
        return <FileText size={18} color="#00A896" />;
      default:
        return <Info size={18} color="#64748B" />;
    }
  };

  return (
    <main className="content">
      {/* HEADER */}
      <PageHeader
        badge="Clinical Alerts & Messages"
        badgeIcon={Bell}
        title="Notification Center"
        subtitle={
          <>
            Reminders, lab alerts, and schedule updates for <strong>{patient?.name}</strong>.
          </>
        }
        actions={
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--color-card-bg, #FFFFFF)",
                  border: "1px solid var(--border, #CBD5E1)",
                  color: "var(--text, #334155)",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <Check size={14} /> Mark All Read
              </button>
            )}

            <button
              type="button"
              onClick={handleRequestBrowserPerm}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: browserPermStatus === "granted" ? "#ECFDF5" : "var(--light-blue, #EFF6FF)",
                border: browserPermStatus === "granted" ? "1px solid #A7F3D0" : "1px solid var(--border, #BFDBFE)",
                color: browserPermStatus === "granted" ? "#065F46" : "var(--blue, #1E40AF)",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <Volume2 size={14} />
              {browserPermStatus === "granted" ? "Desktop Alerts: Active ✓" : "Enable Browser Alerts"}
            </button>
          </div>
        }
      />

      {/* FILTER BUTTONS / TABS */}
      <div className="medix-tabs-divider" style={{ borderBottom: "none", margin: "24px 0 24px 0", paddingBottom: 0 }}>
        {[
          { key: "all", label: `All (${notifications.length})` },
          { key: "unread", label: `Unread (${unreadCount})` },
          { key: "appointment", label: "Appointments" },
          { key: "medication", label: "Medication Reminders" },
          { key: "report", label: "Lab Reports" }
        ].map(btn => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setFilter(btn.key)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border, #E2E8F0)",
              background: filter === btn.key ? "#0B4F8A" : "var(--color-card-bg, #FFFFFF)",
              color: filter === btn.key ? "#FFFFFF" : "var(--muted, #475569)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "var(--color-card-bg, #FFFFFF)", borderRadius: "16px", border: "1px dashed var(--border, #CBD5E1)", color: "var(--muted, #64748B)" }}>
            <Bell size={32} style={{ display: "block", margin: "0 auto 10px auto", opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 600, color: "var(--text, #0F172A)" }}>No notifications in this view.</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              style={{
                background: notif.read ? "var(--color-card-bg, #FFFFFF)" : "var(--color-subtle-bg, #F0F7FF)",
                border: notif.read ? "1px solid var(--border, #E2E8F0)" : "1.5px solid var(--blue, #93C5FD)",
                borderRadius: "14px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ background: "var(--color-subtle-bg, #FFFFFF)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border, #E2E8F0)", marginTop: "2px" }}>
                  {getCategoryIcon(notif.category)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text, #0F172A)" }}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2563EB", display: "inline-block" }} />
                    )}
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text, #475569)" }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: "11px", color: "var(--muted, #94A3B8)", marginTop: "6px", display: "block" }}>
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(notif.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--blue, #0B4F8A)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    textDecoration: "underline"
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
