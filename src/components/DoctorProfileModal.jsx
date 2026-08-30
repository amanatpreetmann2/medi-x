import React from 'react';
import {
  X,
  Star,
  Calendar,
  Stethoscope,
  MapPin,
  Clock,
  Award,
  GraduationCap,
  Languages,
  ShieldCheck,
  CheckCircle,
  Video
} from 'lucide-react';

export default function DoctorProfileModal({ doctor, isOpen, onClose, onBookNow }) {
  if (!isOpen || !doctor) return null;

  // Rich doctor details based on doctor data
  const getDoctorDetails = (doc) => {
    return {
      experience: doc.experience || "12+ Years Experience",
      education: doc.education || "MD, Harvard Medical School • Residency at Johns Hopkins Hospital",
      boardCertified: "American Board of Medical Specialties (ABMS)",
      languages: doc.languages || "English, Spanish",
      hospital: doc.hospital || "Medi-X Central Medical Campus & Telehealth",
      consultationFee: "$65 (Covered by most insurance plans)",
      bio: doc.bio || `${doc.name} is a board-certified specialist in ${doc.specialty} with a dedicated focus on patient-centered preventive medicine and clinical diagnostics.`,
      reviewsCount: "148 Patient Reviews",
      acceptedInsurance: ["Blue Cross Blue Shield", "Aetna", "UnitedHealthcare", "Medicare", "Cigna"]
    };
  };

  const details = getDoctorDetails(doctor);

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
          borderRadius: '18px',
          width: '100%',
          maxWidth: '620px',
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
        {/* MODAL HEADER WITH DOCTOR PHOTO & BADGES */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            background: 'linear-gradient(135deg, var(--light-blue, #f0f7ff) 0%, rgba(8, 123, 130, 0.08) 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--blue, #07539a)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(7, 83, 154, 0.25)',
                flexShrink: 0
              }}
            >
              {doctor.initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text, #1e293b)' }}>
                  {doctor.name}
                </h2>
                <ShieldCheck size={18} color="#0284c7" title="Verified Board Certified Physician" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--blue, #07539a)' }}>{doctor.specialty}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
                  <Star size={14} fill="currentColor" />
                  {doctor.rating || "4.9"}
                </span>
                <span style={{ color: 'var(--muted, #64748b)', fontSize: '0.8rem' }}>({details.reviewsCount})</span>
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

        {/* MODAL BODY */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Highlight Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              textAlign: 'center'
            }}
          >
            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
              <Award size={18} color="#0284c7" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted, #64748b)' }}>EXPERIENCE</div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text, #1e293b)' }}>{details.experience}</strong>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
              <Clock size={18} color="#059669" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted, #64748b)' }}>NEXT OPENING</div>
              <strong style={{ fontSize: '0.85rem', color: '#059669' }}>{doctor.next || "Today"}</strong>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
              <Languages size={18} color="#8b5cf6" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted, #64748b)' }}>LANGUAGES</div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text, #1e293b)' }}>{details.languages}</strong>
            </div>
          </div>

          {/* About Doctor */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text, #1e293b)' }}>
              About Doctor
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text, #475569)', lineHeight: 1.6 }}>
              {doctor.description || details.bio}
            </p>
          </div>

          {/* Education & Credentials */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'var(--bg, #f8fafc)',
              border: '1px solid var(--border, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.8125rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <GraduationCap size={18} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text, #1e293b)' }}>Education & Residency</strong>
                <span style={{ color: 'var(--muted, #64748b)' }}>{details.education}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={18} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text, #1e293b)' }}>Practice Location</strong>
                <span style={{ color: 'var(--muted, #64748b)' }}>{doctor.location} • {details.hospital}</span>
              </div>
            </div>
          </div>

          {/* Insurance Accepted */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text, #1e293b)' }}>
              Accepted Insurance Networks
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {details.acceptedInsurance.map((ins, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    background: 'var(--light-blue, #f0f7ff)',
                    border: '1px solid var(--border, #bae6fd)',
                    fontSize: '0.75rem',
                    color: 'var(--blue, #0369a1)',
                    fontWeight: 500
                  }}
                >
                  <CheckCircle size={12} color="#0284c7" />
                  {ins}
                </span>
              ))}
            </div>
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
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted, #64748b)' }}>
              Est. Copay / Consultation
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text, #1e293b)' }}>
              {details.consultationFee}
            </strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--color-white, #ffffff)',
                color: 'var(--text, #334155)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onBookNow) onBookNow(doctor);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--blue, #07539a)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(7, 83, 154, 0.25)'
              }}
            >
              <Calendar size={16} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
