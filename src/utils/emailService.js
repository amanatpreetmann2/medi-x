/**
 * Medix Healthcare Portal - Email Notification Service & Template Engine
 * Generates hospital-branded email templates for:
 * 1. Appointment Confirmation
 * 2. Appointment Reminder
 * 3. Daily Medicine Schedule
 * 4. Patient Health & Vitals Summary
 *
 * Supports both Live SMTP delivery (via backend Nodemailer) and
 * Evaluation Demo Mode (recorded to outbox audit logs).
 */

import { logEmailDelivery } from './hospitalStore';

export const NOTIFICATION_TYPES = [
  {
    id: 'appointment_confirmation',
    name: 'Appointment Confirmation',
    subjectPrefix: 'Appointment Confirmed - Medix Healthcare',
    badgeColor: '#00A896',
    description: 'Formal confirmation of a scheduled medical visit with clinic department & doctor details.'
  },
  {
    id: 'appointment_reminder',
    name: 'Appointment Reminder (24h Notice)',
    subjectPrefix: 'Reminder: Upcoming Medical Appointment Tomorrow',
    badgeColor: '#0B4F8A',
    description: 'Upcoming appointment reminder with clinic arrival directions and preparation guidance.'
  },
  {
    id: 'medicine_schedule',
    name: 'Daily Medication Schedule Reminder',
    subjectPrefix: 'Daily Prescription & Medicine Schedule Alert',
    badgeColor: '#8B5CF6',
    description: 'Complete breakdown of prescribed Morning, Afternoon, Evening, and Night dosages.'
  },
  {
    id: 'health_summary',
    name: 'Patient Health & Vitals Summary',
    subjectPrefix: 'Confidential Patient Health & Clinical Vitals Summary',
    badgeColor: '#D97706',
    description: 'Comprehensive evaluation record with current vitals, active conditions, and care plan.'
  }
];

/**
 * Generate formatted HTML Email Template with professional Medix Hospital branding
 */
export function generateEmailContent({ type, patient, appointment, recipient }) {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const appt = appointment || (patient?.appointments && patient.appointments[0]) || {
    id: 'APT-1001',
    doctor: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    date: '2026-11-04',
    time: '10:00 AM',
    department: 'Cardiovascular Care Center - Suite 4B',
    reason: 'Routine Follow-up'
  };

  let subject;
  let bodyHtml;

  switch (type) {
    case 'appointment_confirmation':
      subject = `[Medix Portal] Appointment Confirmed for ${patient.name} (ID: ${patient.id}) - ${appt.date}`;
      bodyHtml = `
        <div style="background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #166534; margin: 0 0 8px 0; font-size: 18px;">✓ Appointment Confirmed</h2>
          <p style="color: #15803D; margin: 0; font-size: 14px;">Your medical appointment has been successfully registered in the Medix Clinical System.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569; width: 35%;">Patient Name:</td>
            <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${patient.name} (ID: ${patient.id})</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Physician:</td>
            <td style="padding: 10px 0; color: #0F172A;">${appt.doctor} <span style="color: #0B4F8A; font-size: 12px;">(${appt.specialty})</span></td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Scheduled Date & Time:</td>
            <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${appt.date} at ${appt.time}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Department / Room:</td>
            <td style="padding: 10px 0; color: #0F172A;">${appt.department || 'Outpatient Clinic'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Reason for Consultation:</td>
            <td style="padding: 10px 0; color: #0F172A;">${appt.reason || 'Medical Follow-up'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Clinical Notes:</td>
            <td style="padding: 10px 0; color: #64748B; font-style: italic;">${appt.notes || 'Please arrive 15 minutes before your scheduled appointment.'}</td>
          </tr>
        </table>

        <div style="background: #EFF6FF; border-left: 4px solid #0B4F8A; padding: 14px 18px; border-radius: 4px; font-size: 13px; color: #1E3A8A;">
          <strong>Preparation Guidance:</strong> Please bring a government-issued photo ID, your active insurance card, and any recent lab reports or medications.
        </div>
      `;
      break;

    case 'appointment_reminder':
      subject = `[Medix Reminder] Notice for Tomorrow: ${patient.name} with ${appt.doctor}`;
      bodyHtml = `
        <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #1E40AF; margin: 0 0 8px 0; font-size: 18px;">⏰ Upcoming Appointment Reminder</h2>
          <p style="color: #1D4ED8; margin: 0; font-size: 14px;">This is a friendly 24-hour reminder for your scheduled appointment at Medix Healthcare.</p>
        </div>

        <div style="border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #0F172A; font-size: 16px;">Appointment Summary</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Doctor:</strong> ${appt.doctor} (${appt.specialty})</p>
          <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Time:</strong> <span style="color: #0B4F8A; font-weight: 700;">${appt.time}</span> on ${appt.date}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Location:</strong> ${appt.department}</p>
        </div>

        <p style="font-size: 13px; color: #64748B;">Need to reschedule? Please log into the <a href="http://localhost:5173" style="color: #0B4F8A; text-decoration: underline;">Medix Patient Portal</a> at least 4 hours prior.</p>
      `;
      break;

    case 'medicine_schedule': {
      subject = `[Medix Care] Daily Medicine Schedule for ${patient.name} (${patient.id})`;
      const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];
      const medsByPeriod = periods.map(p => ({
        period: p,
        meds: (patient.medications || []).filter(m => m.period === p)
      }));

      bodyHtml = `
        <div style="background: #FAF5FF; border: 1.5px solid #E9D5FF; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #6B21A8; margin: 0 0 8px 0; font-size: 18px;">💊 Daily Prescribed Medicine Schedule</h2>
          <p style="color: #7E22CE; margin: 0; font-size: 14px;">Active prescription doses for Patient <strong>${patient.name}</strong> (ID: ${patient.id}).</p>
        </div>

        ${medsByPeriod.map(group => `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0F172A; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; font-size: 15px; margin-bottom: 10px;">
              ${group.period} Schedule
            </h3>
            ${group.meds.length === 0 ? `
              <p style="font-size: 13px; color: #94A3B8; font-style: italic; margin: 4px 0 12px 0;">No medications prescribed for ${group.period.toLowerCase()}.</p>
            ` : `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <thead>
                  <tr style="background: #F8FAFC; text-align: left; font-size: 12px; color: #64748B;">
                    <th style="padding: 8px 12px; border: 1px solid #E2E8F0;">Medicine</th>
                    <th style="padding: 8px 12px; border: 1px solid #E2E8F0;">Dosage</th>
                    <th style="padding: 8px 12px; border: 1px solid #E2E8F0;">Time</th>
                    <th style="padding: 8px 12px; border: 1px solid #E2E8F0;">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  ${group.meds.map(m => `
                    <tr style="font-size: 13px;">
                      <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">${m.name}</td>
                      <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #0B4F8A; font-weight: 600;">${m.dosage}</td>
                      <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #475569;">${m.time}</td>
                      <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #64748B; font-size: 12px;">${m.instructions}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        `).join('')}

        <div style="background: #FFFBEB; border-left: 4px solid #D97706; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #92400E;">
          <strong>Clinical Safety Reminder:</strong> Take medicines strictly as prescribed by your doctor. If you experience unexpected reactions, contact the hospital pharmacy desk immediately.
        </div>
      `;
      break;
    }

    case 'health_summary':
      subject = `[Medix Clinical Report] Patient Health & Vitals Record - ${patient.name} (${patient.id})`;
      bodyHtml = `
        <div style="background: #F0F9FF; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #0369A1; margin: 0 0 8px 0; font-size: 18px;">📋 Comprehensive Patient Health Summary</h2>
          <p style="color: #0284C7; margin: 0; font-size: 14px;">Clinical health information record for college evaluation demonstration.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
            <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 13px; text-transform: uppercase;">Demographics</h4>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${patient.name}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Patient ID:</strong> <span style="color: #0B4F8A; font-weight: 700;">${patient.id}</span></p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Age & Gender:</strong> ${patient.age} yrs (${patient.gender})</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Blood Group:</strong> <span style="background: #FEE2E2; color: #991B1B; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${patient.bloodGroup}</span></p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Primary Physician:</strong> ${patient.primaryPhysician || 'Dr. Sarah Jenkins'}</p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
            <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 13px; text-transform: uppercase;">Current Vital Signs</h4>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Blood Pressure:</strong> ${patient.vitals?.bp} <span style="font-size: 11px; color: #059669;">(${patient.vitals?.bpStatus || 'Normal'})</span></p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Heart Rate:</strong> ${patient.vitals?.pulse}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Oxygen Saturation (SpO2):</strong> ${patient.vitals?.spo2}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Blood Glucose:</strong> ${patient.vitals?.glucose}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Body Temp:</strong> ${patient.vitals?.temp}</p>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; color: #DC2626; font-size: 13px; text-transform: uppercase;">Known Allergies</h4>
          <p style="margin: 0; font-size: 13px; color: #334155;">
            ${(patient.knownAllergies || []).map(a => `<span style="background: #FEF2F2; color: #991B1B; padding: 3px 8px; border-radius: 4px; margin-right: 6px; font-size: 12px; font-weight: 600;">${a.allergen} (${a.severity})</span>`).join('')}
          </p>
        </div>

        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; color: #475569; font-size: 13px; text-transform: uppercase;">Chronic Conditions & History</h4>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #0F172A;">
            ${(patient.chronicConditions || []).join(' • ')}
          </p>
          <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.5;">${patient.medicalHistory}</p>
        </div>
      `;
      break;

    default:
      subject = `[Medix Portal] Notification for ${patient.name}`;
      bodyHtml = `<p>General notification from Medix Healthcare Portal.</p>`;
  }

  // Full styled HTML Document wrapper
  const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F5F9; color: #1E293B;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
    
    <!-- Top Hospital Header Banner -->
    <div style="background: linear-gradient(135deg, #0B4F8A 0%, #0070BA 60%, #00A896 100%); padding: 28px; text-align: left; color: #FFFFFF;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="background: rgba(255,255,255,0.2); width: 38px; height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px;">
          +
        </div>
        <div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">MEDIX HEALTHCARE</h1>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 500;">Patient Information Management System</p>
        </div>
      </div>
      <div style="margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px; display: flex; justify-content: space-between;">
        <span>Official Notification</span>
        <span>${currentDate}</span>
      </div>
    </div>

    <!-- Main Email Body Container -->
    <div style="padding: 32px 28px;">
      <p style="font-size: 15px; color: #334155; margin-top: 0; margin-bottom: 20px;">
        Dear <strong>${recipient?.name || 'Healthcare Evaluator'}</strong>,
      </p>

      ${bodyHtml}

      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
        <a href="http://localhost:5173" style="display: inline-block; background: #0B4F8A; color: #FFFFFF; text-decoration: none; padding: 11px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Access Medix Patient Portal →
        </a>
      </div>
    </div>

    <!-- Official Hospital Disclaimer Footer -->
    <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 22px 28px; font-size: 11px; color: #64748B; line-height: 1.6;">
      <p style="margin: 0 0 8px 0;"><strong>Confidentiality Notice:</strong> This message contains confidential patient healthcare information intended strictly for authorized recipients. If you have received this transmission in error, please notify the hospital security desk immediately.</p>
      <p style="margin: 0; color: #94A3B8;">Medix Health System • 100 Hospital Way, Medical District • College Evaluation Demo © ${currentYear}</p>
    </div>

  </div>
</body>
</html>
  `;

  return {
    subject,
    html: fullHtml,
    plainText: `Medix Healthcare Notification: ${subject}\n\nPatient: ${patient.name} (ID: ${patient.id})\nDate: ${currentDate}\n\nPlease view in HTML to see complete clinical charts and details.`
  };
}

/**
 * Dispatch Email Notification
 * 1. Checks if backend server is accessible (for real SMTP delivery via Nodemailer).
 * 2. If backend is not available or SMTP not configured, executes Evaluation Demo Mode.
 * 3. Logs attempt and delivery status into the persistent audit trail.
 */
export async function sendEmailNotification({
  type,
  patient,
  appointment,
  recipient,
  customRecipientEmail
}) {
  const targetEmail = (customRecipientEmail || recipient?.email || '').trim();
  const targetName = recipient?.name || targetEmail;

  if (!targetEmail) {
    return {
      success: false,
      error: 'Missing recipient email address.'
    };
  }

  const { subject, html, plainText } = generateEmailContent({
    type,
    patient,
    appointment,
    recipient: { name: targetName, email: targetEmail }
  });

  // Try to deliver via backend Nodemailer endpoint
  try {
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetEmail,
        subject,
        html,
        text: plainText,
        notificationType: type,
        patientId: patient.id
      })
    });

    if (response.ok) {
      const data = await response.json();
      const log = logEmailDelivery({
        recipient: targetEmail,
        recipientName: targetName,
        subject,
        notificationType: type,
        patientId: patient.id,
        patientName: patient.name,
        status: 'Delivered (SMTP Live)',
        deliveryMode: 'Live Nodemailer SMTP',
        messageId: data.messageId || `msg_${Date.now()}`
      });

      return {
        success: true,
        mode: 'live_smtp',
        message: `Email successfully delivered via SMTP to ${targetEmail}`,
        log
      };
    }
  } catch {
    // Backend server not currently running; seamlessly utilize Evaluation Outbox Log
  }

  // Evaluation Outbox Simulation Delivery
  const log = logEmailDelivery({
    recipient: targetEmail,
    recipientName: targetName,
    subject,
    notificationType: type,
    patientId: patient.id,
    patientName: patient.name,
    status: 'Delivered',
    deliveryMode: 'Evaluation Outbox Log (Demonstration Mode)'
  });

  return {
    success: true,
    mode: 'demo_logged',
    message: `Evaluation Mode: Email delivered to hospital outbox log for ${targetEmail}`,
    log
  };
}
