import React, { useState } from "react";
import {
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sun,
  Clock3,
  Info,
  Store,
  Phone,
} from "lucide-react";

const initialMedications = [
  {
    id: 1,
    name: "Lisinopril",
    dose: "10mg",
    instruction: "With food",
    time: "8:00 AM",
    period: "Morning",
    taken: true,
    takenTime: "TAKEN AT 8:15 AM",
  },
  {
    id: 2,
    name: "Atorvastatin",
    dose: "20mg",
    instruction: "Take with water",
    time: "8:00 AM",
    period: "Morning",
    taken: true,
    takenTime: "TAKEN AT 8:15 AM",
  },
  {
    id: 3,
    name: "Metformin",
    dose: "500mg",
    instruction: "With lunch",
    time: "2:00 PM",
    period: "Afternoon",
    taken: false,
    takenTime: "",
  },
];

function Medications() {
  const [medications, setMedications] = useState(initialMedications);

  const takenCount = medications.filter((med) => med.taken).length;
  const totalCount = medications.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);

  const toggleMedication = (id) => {
    setMedications((current) =>
      current.map((med) =>
        med.id === id
          ? {
              ...med,
              taken: !med.taken,
              takenTime: !med.taken ? "TAKEN JUST NOW" : "",
            }
          : med
      )
    );
  };

  const morningMeds = medications.filter(
    (med) => med.period === "Morning"
  );

  const afternoonMeds = medications.filter(
    (med) => med.period === "Afternoon"
  );

  return (
    <div className="medications-content">
      {/* PAGE HEADER */}
      <div className="medication-page-header">
        <div>
          <h1>Medication Tracking</h1>
          <p>Manage your prescriptions and daily schedule.</p>
        </div>

        <button className="add-medication-btn">
          <Plus size={18} />
          Add Medication
        </button>
      </div>

      {/* MAIN MEDICATION AREA */}
      <div className="medication-layout">
        {/* LEFT SIDE */}
        <div className="medication-schedule">
          {/* DATE */}
          <div className="medication-date">
            <button className="date-arrow">
              <ChevronLeft size={22} />
            </button>

            <div>
              <h2>Today, Oct 24</h2>
              <span>{totalCount} MEDICATIONS SCHEDULED</span>
            </div>

            <button className="date-arrow">
              <ChevronRight size={22} />
            </button>
          </div>

          {/* PROGRESS */}
          <div className="daily-progress-header">
            <span>Today's Medications</span>
            <strong>
              {takenCount} / {totalCount}
            </strong>
          </div>

          <div className="daily-progress-bar">
            <div
              className="daily-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* MORNING */}
          {morningMeds.length > 0 && (
            <div className="medication-time-section">
              <div className="time-heading">
                <span className="time-period">Morning</span>

                <div className="sun-icon">
                  <Sun size={19} />
                </div>

                <h3>8:00 AM</h3>
              </div>

              <div className="medication-list">
                {morningMeds.map((med) => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onToggle={toggleMedication}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AFTERNOON */}
          {afternoonMeds.length > 0 && (
            <div className="medication-time-section">
              <div className="time-heading">
                <span className="time-period">Afternoon</span>

                <div className="sun-icon">
                  <Sun size={19} />
                </div>

                <h3>2:00 PM</h3>
              </div>

              <div className="medication-list">
                {afternoonMeds.map((med) => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onToggle={toggleMedication}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ALL DONE MESSAGE */}
          {takenCount === totalCount && totalCount > 0 && (
            <div className="all-medications-done">
              <div className="done-check">
                <Check size={22} />
              </div>

              <div>
                <h3>All medications done!</h3>
                <p>
                  Great job! You completed all of today's scheduled
                  medications.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="medication-right-column">
          {/* ADHERENCE */}
          <div className="adherence-card">
            <div className="adherence-title">WEEKLY ADHERENCE</div>

            <div className="adherence-score">
              92%
              <span>Great job!</span>
            </div>

            <div className="weekly-bars">
              <div>
                <span className="bar filled"></span>
                <small>M</small>
              </div>

              <div>
                <span className="bar filled"></span>
                <small>T</small>
              </div>

              <div>
                <span className="bar filled"></span>
                <small>W</small>
              </div>

              <div>
                <span className="bar"></span>
                <small>T</small>
              </div>

              <div>
                <span className="bar filled"></span>
                <small>F</small>
              </div>

              <div>
                <span className="bar filled"></span>
                <small>S</small>
              </div>

              <div>
                <span className="bar filled"></span>
                <small>S</small>
              </div>
            </div>
          </div>

          {/* PRESCRIPTIONS */}
          <div className="prescriptions-section">
            <div className="prescriptions-heading">
              <h2>
                Active
                <br />
                Prescriptions
              </h2>

              <button>View All</button>
            </div>

            {/* PRESCRIPTION 1 */}
            <div className="prescription-card">
              <div className="prescription-top">
                <strong>Lisinopril</strong>
                <Info size={16} />
              </div>

              <p>10mg • 30 Day Supply</p>

              <div className="prescription-bottom">
                <span>12 Refills left</span>

                <button>Request Refill</button>
              </div>
            </div>

            {/* PRESCRIPTION 2 */}
            <div className="prescription-card low-stock">
              <div className="prescription-top">
                <strong>
                  Metformin <span className="warning">⚠</span>
                </strong>

                <Info size={16} />
              </div>

              <p>500mg • Low supply (4 days)</p>

              <div className="prescription-bottom">
                <span>0 Refills left</span>

                <button>Contact Doctor</button>
              </div>
            </div>
          </div>

          {/* PHARMACY */}
          <div className="pharmacy-card">
            <div className="pharmacy-icon">
              <Store size={22} />
            </div>

            <div className="pharmacy-info">
              <strong>CVS Pharmacy #1234</strong>
              <span>123 Main St, Springfield</span>
            </div>

            <Phone size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* MEDICATION CARD */

function MedicationCard({ medication, onToggle }) {
  return (
    <div
      className={`medication-card ${
        medication.taken ? "medication-taken" : "medication-pending"
      }`}
    >
      <button
        className={`medication-check ${
          medication.taken ? "checked" : ""
        }`}
        onClick={() => onToggle(medication.id)}
        aria-label={`Mark ${medication.name} as ${
          medication.taken ? "not taken" : "taken"
        }`}
      >
        {medication.taken && <Check size={20} />}
      </button>

      <div className="medication-details">
        <h3>{medication.name}</h3>

        <p>
          {medication.dose} • {medication.instruction}
        </p>

        {medication.taken ? (
          <span className="taken-label">
            {medication.takenTime}
          </span>
        ) : (
          <span className="upcoming-label">
            <Clock3 size={13} />
            UPCOMING
          </span>
        )}
      </div>

      <div className="medication-card-time">
        <Clock3 size={18} />
        <span>{medication.time}</span>
      </div>
    </div>
  );
}

export default Medications;