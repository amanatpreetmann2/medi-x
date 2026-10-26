import React, { useState } from 'react';
import { ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { getAllPatients } from '../utils/hospitalStore';

export default function DemoSwitcher({ currentPatientId, onSwitchPatient, onSwitchToAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const patients = getAllPatients();
  const currentPatient = patients.find(p => p.id === currentPatientId) || patients[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)',
          border: '1.5px solid #BFDBFE',
          borderRadius: '20px',
          cursor: 'pointer',
          color: '#1E40AF',
          fontSize: '12px',
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(30, 64, 175, 0.08)'
        }}
        title="Switch demo patient account for evaluation"
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
        <span>Evaluation Demo: <strong>{currentPatient?.name}</strong> ({currentPatient?.id})</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '290px',
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              zIndex: 999,
              padding: '10px',
              animation: 'fadeInUp 0.2s ease-out'
            }}
          >
            <div style={{ padding: '6px 10px 10px 10px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Switch Evaluation Patient
              </span>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                Each patient displays distinct medical schedules & vitals.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0' }}>
              {patients.map(p => {
                const isSelected = p.id === currentPatientId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (onSwitchPatient) onSwitchPatient(p);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {p.id} • {p.bloodGroup} • {(p.chronicConditions || [])[0]}
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="#0B4F8A" />}
                  </button>
                );
              })}
            </div>

            {onSwitchToAdmin && (
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onSwitchToAdmin();
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#FAF5FF',
                    color: '#7E22CE',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Open Evaluation Admin Panel</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
