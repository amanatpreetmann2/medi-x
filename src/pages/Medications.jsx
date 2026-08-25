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
  X
} from "lucide-react";


// DEMO START DATE
// UI mein Today = Oct 24, 2023
const DEMO_TODAY = new Date(2023, 9, 24);


const initialMedications = [
  {
    id: 1,
    name: "Lisinopril",
    dose: "10mg",
    instruction: "With food",
    time: "8:00 AM",
    period: "Morning"
  },

  {
    id: 2,
    name: "Atorvastatin",
    dose: "20mg",
    instruction: "Take with water",
    time: "8:00 AM",
    period: "Morning"
  },

  {
    id: 3,
    name: "Metformin",
    dose: "500mg",
    instruction: "With lunch",
    time: "2:00 PM",
    period: "Afternoon"
  }
];


function Medications() {

  // 0 = Oct 24
  // -1 = Oct 23
  // +1 = Oct 25
  const [dateOffset, setDateOffset] = useState(0);


  const [medications, setMedications] =
    useState(initialMedications);


  const selectedDate = new Date(DEMO_TODAY);

  selectedDate.setDate(
    DEMO_TODAY.getDate() + dateOffset
  );


  const isToday = dateOffset === 0;
  const isPast = dateOffset < 0;
  const isFuture = dateOffset > 0;


  /*
    Generate status according to selected date
  */

  const getMedicationsForDate = () => {

    return medications.map((med) => {

      // TODAY
      if (isToday) {

        if (med.id === 1 || med.id === 2) {

          return {
            ...med,
            taken: true,
            missed: false,
            takenTime: "TAKEN AT 8:15 AM"
          };

        }

        return {
          ...med,
          taken: false,
          missed: false,
          takenTime: ""
        };
      }


      // PAST DATE
      if (isPast) {

        // Oct 23 demo:
        // Lisinopril = taken
        // Atorvastatin = taken
        // Metformin = missed

        if (dateOffset === -1) {

          if (med.id === 3) {

            return {
              ...med,
              taken: false,
              missed: true,
              takenTime: ""
            };

          }

          return {
            ...med,
            taken: true,
            missed: false,
            takenTime: "TAKEN AT 8:10 AM"
          };
        }


        // Older dates = all completed

        return {
          ...med,
          taken: true,
          missed: false,
          takenTime: "TAKEN"
        };
      }


      // FUTURE DATE
      return {
        ...med,
        taken: false,
        missed: false,
        takenTime: ""
      };

    });
  };


  const displayedMedications =
    getMedicationsForDate();


  const takenCount =
    displayedMedications.filter(
      (med) => med.taken
    ).length;


  const missedCount =
    displayedMedications.filter(
      (med) => med.missed
    ).length;


  const totalCount =
    displayedMedications.length;


  const progress =
    totalCount === 0
      ? 0
      : Math.round(
          (takenCount / totalCount) * 100
        );


  /*
    Toggle only works for TODAY
  */

  const toggleMedication = (id) => {

    if (!isToday) return;


    setMedications((current) =>

      current.map((med) =>

        med.id === id
          ? {
              ...med,
              taken: !med.taken
            }
          : med

      )

    );
  };


  const morningMeds =
    displayedMedications.filter(
      (med) => med.period === "Morning"
    );


  const afternoonMeds =
    displayedMedications.filter(
      (med) => med.period === "Afternoon"
    );


  /*
    Date formatting
  */

  const month =
    selectedDate.toLocaleString(
      "en-US",
      {
        month: "short"
      }
    );


  const day =
    selectedDate.getDate();


  /*
    Move dates
  */

  const previousDay = () => {

    setDateOffset(
      (current) => current - 1
    );

  };


  const nextDay = () => {

    setDateOffset(
      (current) => current + 1
    );

  };


  return (

    <div className="medications-content">


      {/* PAGE HEADER */}

      <div className="medication-page-header">

        <div>

          <h1>
            Medication Tracking
          </h1>

          <p>
            Manage your prescriptions and daily schedule.
          </p>

        </div>


        <button
          className="add-medication-btn"
        >

          <Plus size={18} />

          Add Medication

        </button>

      </div>



      {/* MAIN */}

      <div className="medication-layout">


        {/* LEFT */}

        <div className="medication-schedule">


          {/* DATE */}

          <div className="medication-date">


            <button
              className="date-arrow"
              onClick={previousDay}
            >

              <ChevronLeft size={22} />

            </button>


            <div>

              <h2>

                {isToday
                  ? "Today"
                  : isPast
                  ? dateOffset === -1
                    ? "Yesterday"
                    : month
                  : dateOffset === 1
                  ? "Tomorrow"
                  : month
                }

                {!isToday &&
                  `, ${month} ${day}`}

                {isToday &&
                  `, ${month} ${day}`}

              </h2>


              <span>

                {isFuture
                  ? `${totalCount} MEDICATIONS SCHEDULED`
                  : `${totalCount} MEDICATIONS SCHEDULED`
                }

              </span>

            </div>


            <button
              className="date-arrow"
              onClick={nextDay}
            >

              <ChevronRight size={22} />

            </button>


          </div>



          {/* DATE STATUS */}

          {isPast && (

            <div className="date-status past-status">

              <span>
                Past medication record
              </span>

              {missedCount > 0 && (
                <strong>
                  {missedCount} missed
                </strong>
              )}

            </div>

          )}


          {isToday && (

            <div className="date-status today-status">

              Today's medication schedule

            </div>

          )}


          {isFuture && (

            <div className="date-status future-status">

              Upcoming medication schedule

            </div>

          )}



          {/* PROGRESS */}

          <div className="daily-progress-header">

            <span>
              {isFuture
                ? "Upcoming Medications"
                : isPast
                ? "Medication History"
                : "Today's Medications"
              }
            </span>


            <strong>

              {takenCount} / {totalCount}

            </strong>

          </div>


          <div className="daily-progress-bar">

            <div
              className="daily-progress-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>



          {/* MORNING */}

          {morningMeds.length > 0 && (

            <div className="medication-time-section">


              <div className="time-heading">

                <span className="time-period">
                  Morning
                </span>


                <div className="sun-icon">

                  <Sun size={19} />

                </div>


                <h3>
                  8:00 AM
                </h3>

              </div>


              <div className="medication-list">

                {morningMeds.map((med) => (

                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onToggle={toggleMedication}
                    isToday={isToday}
                  />

                ))}

              </div>

            </div>

          )}



          {/* AFTERNOON */}

          {afternoonMeds.length > 0 && (

            <div className="medication-time-section">


              <div className="time-heading">

                <span className="time-period">
                  Afternoon
                </span>


                <div className="sun-icon">

                  <Sun size={19} />

                </div>


                <h3>
                  2:00 PM
                </h3>

              </div>


              <div className="medication-list">

                {afternoonMeds.map((med) => (

                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onToggle={toggleMedication}
                    isToday={isToday}
                  />

                ))}

              </div>

            </div>

          )}



          {/* ALL DONE */}

          {isPast &&
            takenCount === totalCount && (

              <div className="all-medications-done">

                <div className="done-check">

                  <Check size={22} />

                </div>


                <div>

                  <h3>
                    All medications completed!
                  </h3>

                  <p>
                    You completed all scheduled
                    medications on this day.
                  </p>

                </div>

              </div>

            )}



          {/* MISSED */}

          {isPast &&
            missedCount > 0 && (

              <div className="missed-medication-message">

                <div className="missed-icon">

                  <X size={20} />

                </div>


                <div>

                  <h3>
                    {missedCount} medication missed
                  </h3>

                  <p>
                    Review your medication history
                    for this date.
                  </p>

                </div>

              </div>

            )}



          {/* FUTURE MESSAGE */}

          {isFuture && (

            <div className="future-medication-message">

              <div className="future-icon">

                <Clock3 size={22} />

              </div>


              <div>

                <h3>
                  Upcoming medications
                </h3>

                <p>
                  These medications are scheduled
                  for this date.
                </p>

              </div>

            </div>

          )}

        </div>



        {/* RIGHT SIDE */}

        <div className="medication-right-column">


          {/* ADHERENCE */}

          <div className="adherence-card">

            <div className="adherence-title">
              WEEKLY ADHERENCE
            </div>


            <div className="adherence-score">

              92%

              <span>
                Great job!
              </span>

            </div>


            <div className="weekly-bars">

              <div>
                <span className="bar filled" />
                <small>M</small>
              </div>

              <div>
                <span className="bar filled" />
                <small>T</small>
              </div>

              <div>
                <span className="bar filled" />
                <small>W</small>
              </div>

              <div>
                <span className="bar" />
                <small>T</small>
              </div>

              <div>
                <span className="bar filled" />
                <small>F</small>
              </div>

              <div>
                <span className="bar filled" />
                <small>S</small>
              </div>

              <div>
                <span className="bar filled" />
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

              <button>
                View All
              </button>

            </div>


            <div className="prescription-card">

              <div className="prescription-top">

                <strong>
                  Lisinopril
                </strong>

                <Info size={16} />

              </div>


              <p>
                10mg • 30 Day Supply
              </p>


              <div className="prescription-bottom">

                <span>
                  12 Refills left
                </span>


                <button>
                  Request Refill
                </button>

              </div>

            </div>



            <div className="prescription-card low-stock">

              <div className="prescription-top">

                <strong>

                  Metformin{" "}

                  <span className="warning">
                    ⚠
                  </span>

                </strong>

                <Info size={16} />

              </div>


              <p>
                500mg • Low supply (4 days)
              </p>


              <div className="prescription-bottom">

                <span>
                  0 Refills left
                </span>


                <button>
                  Contact Doctor
                </button>

              </div>

            </div>

          </div>



          {/* PHARMACY */}

          <div className="pharmacy-card">

            <div className="pharmacy-icon">

              <Store size={22} />

            </div>


            <div className="pharmacy-info">

              <strong>
                CVS Pharmacy #1234
              </strong>

              <span>
                123 Main St, Springfield
              </span>

            </div>


            <Phone size={20} />

          </div>


        </div>

      </div>

    </div>

  );

}



/* ============================= */
/* MEDICATION CARD */
/* ============================= */

function MedicationCard({
  medication,
  onToggle,
  isToday
}) {

  return (

    <div
      className={`medication-card ${
        medication.taken
          ? "medication-taken"
          : medication.missed
          ? "medication-missed"
          : "medication-pending"
      }`}
    >


      {/* CHECK */}

      <button
        className={`medication-check ${
          medication.taken
            ? "checked"
            : medication.missed
            ? "missed-check"
            : ""
        }`}
        onClick={() =>
          isToday &&
          onToggle(medication.id)
        }
        disabled={!isToday}
      >

        {medication.taken && (
          <Check size={20} />
        )}

        {medication.missed && (
          <X size={18} />
        )}

      </button>



      {/* DETAILS */}

      <div className="medication-details">

        <h3>
          {medication.name}
        </h3>


        <p>
          {medication.dose} •{" "}
          {medication.instruction}
        </p>


        {medication.taken ? (

          <span className="taken-label">

            {medication.takenTime}

          </span>

        ) : medication.missed ? (

          <span className="missed-label">

            MISSED

          </span>

        ) : (

          <span className="upcoming-label">

            <Clock3 size={13} />

            UPCOMING

          </span>

        )}

      </div>



      {/* TIME */}

      <div className="medication-card-time">

        <Clock3 size={18} />

        <span>
          {medication.time}
        </span>

      </div>


    </div>

  );

}


export default Medications;