import React from "react";
import StatsCard from "../components/StatsCard";
import healthBanner from "../assets/health-banner.jpg";
import {
  Activity,
  Calendar,
  Check,
  FileText,
  Pill,
  User,
  UserRound,
  HeartPulse
} from "lucide-react";
function Dashboard({ setPage }) {

  return (
    <main className="content">

  <div
  className="welcome-banner"
  style={{
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(0, 50, 90, 0.8),
        rgba(0, 50, 90, 0.15)
      ),
      url(${healthBanner})
    `
  }}
>
  
  <div>
    <h1>Welcome</h1>
    <p>Here is your health overview for today.</p>
  </div>


  </div>
  <div className="stats-container">

  <StatsCard
    title="Appointments"
    value="12"
    icon={<Calendar size={30} />}
  />

  <StatsCard
    title="Doctors"
    value="8"
    icon={<UserRound size={30} />}
  />

  <StatsCard
    title="Medicines"
    value="24"
    icon={<Pill size={30} />}
  />

  <StatsCard
    title="Health Score"
    value="92%"
    icon={<HeartPulse size={30} />}
  />
</div>

      <div className="dashboard-headings">

        <h2>Health Records</h2>

        <div className="upcoming-heading">

          <h2>Upcoming</h2>

          <button
            onClick={() =>
              setPage("Appointments")
            }
          >
            View All
          </button>

        </div>

      </div>


      <div className="dashboard-grid">


        {/* Lab */}

        <div className="health-card blue-border">

          <div className="health-card-header">

            <small>
              RECENT LAB RESULTS
            </small>

            <FileText size={18} />

          </div>

          <h3>
            Comprehensive Metabolic Panel
          </h3>

          <span>
            Oct 10, 2023
          </span>

          <div className="normal-status">

            <Check size={14} />

            Normal

          </div>

          <button
            onClick={() =>
              setPage("Reports")
            }
          >
            View Report
          </button>

        </div>


        {/* Vaccine */}

        <div className="health-card teal-border">

          <div className="health-card-header">

            <small>
              IMMUNIZATIONS
            </small>

            <Activity size={18} />

          </div>

          <h3>
            Flu Vaccine
          </h3>

          <span>
            Annual Dose
          </span>

          <div className="normal-status">

            <Check size={14} />

            Up to Date

          </div>

        </div>


        {/* Appointment */}

        <div className="upcoming-card">

          <div className="upcoming-date">

            <small>OCT</small>

            <strong>14</strong>

          </div>

          <div className="upcoming-info">

            <strong>
              Cardiology Follow-up
            </strong>

            <span>
              <Calendar size={14} />
              10:30 AM
            </span>

            <span>
              <User size={14} />
              Dr. Alan Smith
            </span>

          </div>

        </div>

      </div>


      <h2 className="section-heading">
        Medications
      </h2>


      <div className="medication-box">

        <div className="medication-row">

          <div className="medicine-icon blue">
            <Pill size={20} />
          </div>

          <div className="medicine-details">

            <strong>
              Lisinopril (10mg)
            </strong>

            <span>
              1 tablet daily, Morning
            </span>

          </div>

          <span className="taken-badge">
            Taken
          </span>

          <div className="circle-check">
            <Check size={15} />
          </div>

        </div>


        <div className="medication-row">

          <div className="medicine-icon blue">
            <Pill size={20} />
          </div>

          <div className="medicine-details">

            <strong>
              Atorvastatin (20mg)
            </strong>

            <span>
              1 tablet daily, Evening
            </span>

          </div>

          <span className="upcoming-badge">
            Upcoming
          </span>

          <div className="empty-circle"></div>

        </div>

      </div>

    </main>
  );
}

export default Dashboard;