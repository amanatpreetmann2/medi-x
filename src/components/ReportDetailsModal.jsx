import React from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function ReportDetailsModal({ report, isOpen, onClose, onDownload }) {
  if (!isOpen || !report) return null;

  // Sample realistic biomarker metrics based on category & title
  const getMetricsForReport = (title, category) => {
    if (title.includes("Metabolic") || title.includes("Kidney")) {
      return [
        { test: "Fasting Blood Glucose", value: "92 mg/dL", range: "70 - 99 mg/dL", status: "Normal" },
        { test: "Blood Urea Nitrogen (BUN)", value: "14 mg/dL", range: "7 - 20 mg/dL", status: "Normal" },
        { test: "Serum Creatinine", value: "0.95 mg/dL", range: "0.70 - 1.30 mg/dL", status: "Normal" },
        { test: "eGFR (Estimated)", value: "> 90 mL/min", range: ">= 60 mL/min", status: "Optimal" },
        { test: "Sodium (Na)", value: "140 mmol/L", range: "135 - 145 mmol/L", status: "Normal" },
        { test: "Potassium (K)", value: "4.2 mmol/L", range: "3.5 - 5.1 mmol/L", status: "Normal" }
      ];
    }
    if (title.includes("Lipid")) {
      return [
        { test: "Total Cholesterol", value: "185 mg/dL", range: "< 200 mg/dL", status: "Desirable" },
        { test: "HDL (Good Cholesterol)", value: "58 mg/dL", range: "> 40 mg/dL", status: "Optimal" },
        { test: "LDL (Calculated)", value: "105 mg/dL", range: "< 100 mg/dL", status: "Borderline" },
        { test: "Triglycerides", value: "110 mg/dL", range: "< 150 mg/dL", status: "Normal" },
        { test: "Cholesterol / HDL Ratio", value: "3.2", range: "< 5.0", status: "Low Risk" }
      ];
    }
    if (title.includes("Blood Count") || title.includes("CBC")) {
      return [
        { test: "White Blood Cells (WBC)", value: "6.8 x10^3/uL", range: "4.0 - 11.0", status: "Normal" },
        { test: "Red Blood Cells (RBC)", value: "4.85 x10^6/uL", range: "4.20 - 5.80", status: "Normal" },
        { test: "Hemoglobin (Hgb)", value: "14.6 g/dL", range: "13.2 - 17.1", status: "Normal" },
        { test: "Hematocrit (Hct)", value: "43.2 %", range: "38.5 - 50.0", status: "Normal" },
        { test: "Platelet Count", value: "245 x10^3/uL", range: "150 - 450", status: "Normal" }
      ];
    }
    if (title.includes("Thyroid")) {
      return [
        { test: "TSH (Thyroid Stimulating)", value: "4.85 uIU/mL", range: "0.45 - 4.50", status: "Slightly High" },
        { test: "Free T4 (Thyroxine)", value: "1.1 ng/dL", range: "0.8 - 1.8", status: "Normal" },
        { test: "Free T3 (Triiodothyronine)", value: "3.0 pg/mL", range: "2.3 - 4.2", status: "Normal" }
      ];
    }
    // Default / Imaging
    return [
      { test: "Clinical Indication", value: "Routine Diagnostic Screening", range: "Standard Protocol", status: "Completed" },
      { test: "Image Clarity & Contrast", value: "Diagnostic Quality Grade A", range: "Grade A - B", status: "Optimal" },
      { test: "Radiological Impression", value: "No acute focal abnormalities observed", range: "Clear", status: "Normal" },
      { test: "Radiation Dose / Exposure", value: "0.02 mSv (Ultra-low)", range: "< 0.10 mSv", status: "Minimal" }
    ];
  };

  const metrics = getMetricsForReport(report.title, report.category);
  const isReview = report.status === "NEEDS REVIEW" || report.type === "review-report";
  const isPending = report.status === "PENDING";

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-white, #FFFFFF)',
          color: 'var(--text, #20242c)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border, #e2e8f0)',
          overflow: 'hidden',
          animation: 'cardFadeIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--light-blue, #f8fafd)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isReview ? '#fee2e2' : '#e0f2fe',
                color: isReview ? '#dc2626' : '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text, #1e293b)' }}>
                {report.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', fontSize: '0.8rem', color: 'var(--muted, #64748b)' }}>
                <span>{report.category}</span>
                <span>•</span>
                <span>Collected: {report.date}</span>
                <span>•</span>
                <span>ID: MX-REP-{Math.abs(report.title.length * 379)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Alert Banner */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isReview ? '#fff1f2' : isPending ? '#f1f5f9' : '#f0fdf4',
              border: `1px solid ${isReview ? '#fecdd3' : isPending ? '#cbd5e1' : '#bbf7d0'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isReview ? (
                <AlertTriangle size={18} color="#e11d48" />
              ) : isPending ? (
                <Clock size={18} color="#64748b" />
              ) : (
                <CheckCircle2 size={18} color="#16a34a" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isReview ? '#9f1239' : isPending ? '#334155' : '#166534' }}>
                Status: {report.status || "FINALIZED"}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: isReview ? '#be123c' : '#475569', fontWeight: 500 }}>
              Verified by Central Medical Lab (CLIA #99D20847)
            </span>
          </div>

          {/* Ordering Doctor & Clinic Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'var(--bg, #f8fafc)',
              border: '1px solid var(--border, #e2e8f0)',
              fontSize: '0.8125rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '0.75rem', marginBottom: '3px' }}>
                ORDERING PHYSICIAN
              </span>
              <strong style={{ color: 'var(--text, #1e293b)' }}>{report.doctor}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '0.75rem', marginBottom: '3px' }}>
                TESTING FACILITY
              </span>
              <strong style={{ color: 'var(--text, #1e293b)' }}>Medi-X Diagnostics & Imaging Center</strong>
            </div>
          </div>

          {/* BIOMARKER / METRICS TABLE */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text, #1e293b)' }}>
              Quantitative Biomarker Results
            </h3>
            <div style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--muted, #475569)' }}>Test Name</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--muted, #475569)' }}>Result</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--muted, #475569)' }}>Standard Range</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--muted, #475569)' }}>Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx !== metrics.length - 1 ? '1px solid var(--border, #f1f5f9)' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 500 }}>{m.test}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: m.status.includes('High') || m.status.includes('Borderline') ? '#e11d48' : 'inherit' }}>
                        {m.value}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--muted, #64748b)' }}>{m.range}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: m.status.includes('High') || m.status.includes('Borderline') ? '#ffe4e6' : '#dcfce7',
                            color: m.status.includes('High') || m.status.includes('Borderline') ? '#be123c' : '#15803d'
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DOCTOR'S CLINICAL NOTES */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'var(--light-blue, #f0f7ff)',
              border: '1px solid var(--border, #bae6fd)',
              fontSize: '0.8125rem'
            }}
          >
            <strong style={{ display: 'block', color: 'var(--blue, #0369a1)', marginBottom: '4px' }}>
              Physician's Clinical Interpretation:
            </strong>
            <p style={{ margin: 0, color: 'var(--text, #334155)', lineHeight: 1.5 }}>
              {isReview
                ? "Some values are slightly outside the standard baseline. A routine follow-up consultation with your physician is recommended within 2 to 3 weeks."
                : isPending
                ? "Laboratory specimens are currently being processed. Full clinical interpretation will be published upon completion."
                : "All tested biomarkers appear within normal reference limits. No acute clinical intervention required at this time. Maintain your current treatment plan."}
            </p>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg, #f8fafc)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--muted, #64748b)' }}>
            <ShieldCheck size={16} color="#0284c7" />
            <span>HIPAA-Certified Patient Record</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                if (onDownload) onDownload(report);
                else window.print();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--color-white, #ffffff)',
                color: 'var(--text, #334155)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--blue, #07539a)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
