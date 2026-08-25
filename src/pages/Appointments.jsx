import React, { useState } from "react";

import {
  Calendar,
  FileText
} from "lucide-react";

function Appointments() {

  const [tab, setTab] =
    useState("Upcoming");


  const upcomingAppointments = [
    {
      month: "OCT",
      date: "24",
      time: "10:00 AM",
      doctor: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      initials: "SJ"
    },

    {
      month: "NOV",
      date: "05",
      time: "2:30 PM",
      doctor: "Dr. Mark Davis",
      specialty: "General Practice",
      initials: "MD"
    }
  ];


  const pastAppointments = [
    {
      month: "SEP",
      date: "12",
      time: "09:15 AM",
      doctor: "Dr. Sarah Jenkins",
      specialty:
        "Cardiology • Annual Physical",
      initials: "SJ"
    },

    {
      month: "AUG",
      date: "28",
      time: "03:45 PM",
      doctor: "Dr. Mark Davis",
      specialty:
        "General Practice • Follow-up",
      initials: "MD"
    }
  ];


  const appointments =
    tab === "Upcoming"
      ? upcomingAppointments
      : pastAppointments;


  return (
    <main className="content">

      <h1 className="page-title">
        Appointments
      </h1>

      <p className="page-subtitle">
        Manage your upcoming and past visits.
      </p>


      <div className="appointment-tabs">

        <button
          className={
            tab === "Upcoming"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setTab("Upcoming")
          }
        >
          Upcoming
        </button>

        <button
          className={
            tab === "Past"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setTab("Past")
          }
        >
          Past
        </button>

      </div>


      <div className="appointment-list">

        {appointments.map(
          (appointment, index) => (

            <div
              className="appointment-card"
              key={index}
            >

              <div className="appointment-date">

                <small>
                  {appointment.month}
                </small>

                <strong>
                  {appointment.date}
                </strong>

                <span>
                  {appointment.time}
                </span>

              </div>


              <div className="doctor-avatar">
                {appointment.initials}
              </div>


              <div className="appointment-doctor">

                <strong>
                  {appointment.doctor}
                </strong>

                <span>
                  {appointment.specialty}
                </span>

              </div>


              <div className="appointment-buttons">

                {tab === "Upcoming" ? (

                  <>
                    <button className="outline-btn">
                      Reschedule
                    </button>

                    <button className="cancel-btn">
                      Cancel
                    </button>
                  </>

                ) : (

                  <button className="outline-btn">

                    <FileText size={15} />

                    View Summary

                  </button>

                )}

              </div>

            </div>

          )
        )}

      </div>


      <div className="appointment-info-box">

        <Calendar size={24} />

        <div>

          <strong>
            Keep your appointments up to date
          </strong>

          <p>
            You can view your scheduled visits here.
            Appointment booking functionality will
            be added in the next evaluation.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Appointments;