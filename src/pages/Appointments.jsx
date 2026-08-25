import React, { useState } from "react";

import {
  Calendar,
  FileText,
  X
} from "lucide-react";

function Appointments() {

  const [tab, setTab] = useState("Upcoming");

  const [appointments, setAppointments] = useState([
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
  ]);

  const pastAppointments = [
    {
      month: "SEP",
      date: "12",
      time: "09:15 AM",
      doctor: "Dr. Sarah Jenkins",
      specialty: "Cardiology • Annual Physical",
      initials: "SJ"
    },

    {
      month: "AUG",
      date: "28",
      time: "03:45 PM",
      doctor: "Dr. Mark Davis",
      specialty: "General Practice • Follow-up",
      initials: "MD"
    }
  ];

  // Calendar modal
  const [showCalendar, setShowCalendar] = useState(false);

  // Which appointment is being rescheduled
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Selected new date
  const [newDate, setNewDate] = useState("");

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];


  const handleReschedule = (index) => {

    setSelectedAppointment(index);

    setNewDate("");

    setShowCalendar(true);

  };


  const confirmReschedule = () => {

    if (!newDate) {
      alert("Please select a date.");
      return;
    }

    const selectedDate = new Date(newDate);

    const months = [
      "JAN", "FEB", "MAR", "APR",
      "MAY", "JUN", "JUL", "AUG",
      "SEP", "OCT", "NOV", "DEC"
    ];

    const updatedAppointments = [...appointments];

    updatedAppointments[selectedAppointment] = {
      ...updatedAppointments[selectedAppointment],

      month: months[selectedDate.getMonth()],

      date: String(selectedDate.getDate()).padStart(2, "0")
    };

    setAppointments(updatedAppointments);

    setShowCalendar(false);

    alert("Appointment rescheduled successfully!");
  };


  return (
    <main className="content">

      <h1 className="page-title">
        Appointments
      </h1>

      <p className="page-subtitle">
        Manage your upcoming and past visits.
      </p>


      {/* TABS */}

      <div className="appointment-tabs">

        <button
          className={
            tab === "Upcoming"
              ? "tab active"
              : "tab"
          }
          onClick={() => setTab("Upcoming")}
        >
          Upcoming
        </button>

        <button
          className={
            tab === "Past"
              ? "tab active"
              : "tab"
          }
          onClick={() => setTab("Past")}
        >
          Past
        </button>

      </div>


      {/* APPOINTMENT LIST */}

      <div className="appointment-list">

        {(tab === "Upcoming"
          ? appointments
          : pastAppointments
        ).map((appointment, index) => (

          <div
            className="appointment-card"
            key={index}
          >

            {/* DATE */}

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


            {/* DOCTOR AVATAR */}

            <div className="doctor-avatar">
              {appointment.initials}
            </div>


            {/* DOCTOR INFO */}

            <div className="appointment-doctor">

              <strong>
                {appointment.doctor}
              </strong>

              <span>
                {appointment.specialty}
              </span>

            </div>


            {/* BUTTONS */}

            <div className="appointment-buttons">

              {tab === "Upcoming" ? (

                <>

                  <button
                    className="outline-btn"
                    onClick={() =>
                      handleReschedule(index)
                    }
                  >
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

        ))}

      </div>


      {/* INFO BOX */}

      <div className="appointment-info-box">

        <Calendar size={24} />

        <div>

          <strong>
            Keep your appointments up to date
          </strong>

          <p>
            You can view and reschedule your
            upcoming visits here.
          </p>

        </div>

      </div>


      {/* RESCHEDULE MODAL */}

      {showCalendar && (

        <div className="calendar-overlay">

          <div className="calendar-modal">

            {/* HEADER */}

            <div className="calendar-modal-header">

              <div>

                <h2>
                  Reschedule Appointment
                </h2>

                <p>
                  Select a new date for your appointment.
                </p>

              </div>

              <button
                className="close-calendar"
                onClick={() =>
                  setShowCalendar(false)
                }
              >
                <X size={20} />
              </button>

            </div>


            {/* CALENDAR */}

            <div className="calendar-box">

              <Calendar size={28} />

              <h3>
                Select Appointment Date
              </h3>

              <p>
                Past dates are not available.
              </p>


              <input
                type="date"
                min={today}
                value={newDate}
                onChange={(e) =>
                  setNewDate(e.target.value)
                }
              />

            </div>


            {/* BUTTONS */}

            <div className="calendar-actions">

              <button
                className="cancel-calendar"
                onClick={() =>
                  setShowCalendar(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-calendar"
                onClick={confirmReschedule}
              >
                Confirm Reschedule
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Appointments;