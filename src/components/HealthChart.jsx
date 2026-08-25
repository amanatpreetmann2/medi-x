import React, { useState } from 'react';
import { HeartPulse, Activity, Flame, ShieldCheck, TrendingUp } from 'lucide-react';

export default function HealthChart() {
  const [activeMetric, setActiveMetric] = useState('heart'); // 'heart' | 'bp' | 'glucose' | 'steps'

  const metricsData = {
    heart: {
      title: 'Heart Rate',
      current: '72 bpm',
      status: 'Optimal Range',
      color: '#07539a',
      lightBg: '#eaf2fc',
      points: [68, 74, 71, 78, 72, 70, 72],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      avg: '72 bpm average this week'
    },
    bp: {
      title: 'Blood Pressure',
      current: '120 / 80',
      status: 'Normal',
      color: '#087b82',
      lightBg: '#e6f5f4',
      points: [118, 122, 119, 124, 120, 118, 120],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      avg: '120 mmHg Systolic Avg'
    },
    glucose: {
      title: 'Blood Glucose',
      current: '95 mg/dL',
      status: 'Normal Fasting',
      color: '#2864a6',
      lightBg: '#f0f7ff',
      points: [92, 98, 94, 99, 95, 93, 95],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      avg: '95 mg/dL Fasting Avg'
    },
    steps: {
      title: 'Daily Activity',
      current: '8,450 steps',
      status: 'Daily Goal Met',
      color: '#10b981',
      lightBg: '#ecfdf5',
      points: [7200, 8100, 9300, 7900, 8450, 10200, 8450],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      avg: '8,500 steps/day average'
    }
  };

  const current = metricsData[activeMetric];

  // SVG Line Chart Coordinate Generator
  const generateSvgPoints = (dataPoints) => {
    const width = 500;
    const height = 140;
    const padding = 20;
    const minVal = Math.min(...dataPoints) * 0.9;
    const maxVal = Math.max(...dataPoints) * 1.1;

    return dataPoints.map((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
      return { x, y, val };
    });
  };

  const svgCoords = generateSvgPoints(current.points);
  const pathD = svgCoords.reduce((acc, pt, i) => (
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  ), '');

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} 140 L ${svgCoords[0].x} 140 Z`;

  return (
    <div className="health-chart-widget" style={{
      background: 'white',
      border: '1px solid #d5dbe6',
      borderRadius: '16px',
      padding: '24px',
      margin: '24px 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={22} color="#07539a" />
            <h2 style={{ fontSize: '20px', color: '#102a43', margin: 0 }}>Vitals & Health Trends</h2>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#626a78' }}>
            Weekly monitoring & real-time patient analytics
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '6px', background: '#f6f8fc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {[
            { id: 'heart', label: 'Heart Rate' },
            { id: 'bp', label: 'Blood Pressure' },
            { id: 'glucose', label: 'Glucose' },
            { id: 'steps', label: 'Activity' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeMetric === tab.id ? '#07539a' : 'transparent',
                color: activeMetric === tab.id ? 'white' : '#454c58',
                fontWeight: activeMetric === tab.id ? 600 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '14px', background: current.lightBg, borderRadius: '12px', border: `1px solid ${current.color}25` }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: current.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {current.title}
          </span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#102a43', marginTop: '4px' }}>
            {current.current}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: '#087b82', fontWeight: 600 }}>
            <ShieldCheck size={14} /> {current.status}
          </div>
        </div>

        <div style={{ padding: '14px', background: '#f8fafe', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: '#626a78', fontWeight: 600 }}>Weekly Average</span>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#102a43', marginTop: '4px' }}>
            {current.avg}
          </div>
        </div>
      </div>

      {/* Interactive SVG Trend Chart */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
        <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={current.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={current.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="20" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
          <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeDasharray="4" />
          <line x1="20" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeDasharray="4" />

          {/* Fill Area */}
          <path d={areaD} fill="url(#chartGrad)" />

          {/* Smooth Trend Line */}
          <path d={pathD} fill="none" stroke={current.color} strokeWidth="3" strokeLinecap="round" />

          {/* Interactive Data Points */}
          {svgCoords.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="white" stroke={current.color} strokeWidth="3" />
              <text x={pt.x} y="138" textAnchor="middle" fill="#626a78" fontSize="10" fontWeight="600">
                {current.labels[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
