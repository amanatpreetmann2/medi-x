import React from "react";

import {
  Calendar,
  HeartPulse,
  Star,
  Stethoscope,
  Video
} from "lucide-react";

function Doctors() {

  const doctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      rating: "4.9",
      initials: "SJ",
      description:
        "Specializing in preventive cardiology and heart failure management with personalized care.",
      next: "Today",
      location: "Main Campus"
    },

    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      rating: "4.8",
      initials: "MC",
      description:
        "Expert in movement disorders and neurodegenerative diseases with patient-centered care.",
      next: "Thu",
      location: "Telehealth"
    },

    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: "5.0",
      initials: "ER",
      description:
        "Dedicated to compassionate care for children from newborns to adolescents.",
      next: "Tomorrow",
      location: "Westside Clinic"
    },

    {
      name: "Dr. Robert Hayes",
      specialty: "Orthopedics",
      rating: "4.7",
      initials: "RH",
      description:
        "Focuses on sports injuries, joint replacement and minimally invasive procedures.",
      next: "Mon",
      location: "Main Campus"
    }
  ];


  return (
    <main className="content">

      <h1 className="page-title">
        Find a Specialist
      </h1>

      <p className="page-subtitle doctor-subtitle">
        Browse our network of healthcare professionals.
        Filter by specialty, availability and patient ratings.
      </p>


      <div className="specialty-buttons">

        <button className="specialty-active">
          All Specialties
        </button>

        <button>
          Cardiology
        </button>

        <button>
          Neurology
        </button>

        <button>
          Pediatrics
        </button>

        <button>
          Orthopedics
        </button>

      </div>


      <div className="doctors-layout">

        {doctors.map(
          (doctor) => (

            <div
              className="doctor-card"
              key={doctor.name}
            >

              <div className="doctor-header">

                <div className="doctor-photo">
                  {doctor.initials}
                </div>

                <div className="doctor-title">

                  <strong>
                    {doctor.name}
                  </strong>

                  <span>
                    {doctor.specialty}
                  </span>

                </div>

                <div className="rating">

                  <Star
                    size={13}
                    fill="currentColor"
                  />

                  {doctor.rating}

                </div>

              </div>


              <p className="doctor-description">
                {doctor.description}
              </p>


              <div className="doctor-info-row">

                <div>

                  <Calendar size={15} />

                  <span>

                    <small>
                      Next
                    </small>

                    {doctor.next}

                  </span>

                </div>


                <div>

                  <Stethoscope size={15} />

                  <span>
                    {doctor.location}
                  </span>

                </div>

              </div>


              <div className="doctor-card-buttons">

                <button className="profile-btn">
                  View Profile
                </button>

                <button className="book-now-btn">
                  Book Now
                </button>

              </div>

            </div>

          )
        )}


        <div className="urgent-care">

          <div className="urgent-icon">
            <HeartPulse size={30} />
          </div>

          <h2>
            Need Urgent Care?
          </h2>

          <p>
            Skip the wait and connect with an
            on-call physician immediately.
          </p>

          <button>

            <Video size={16} />

            Start Virtual Visit

          </button>

        </div>

      </div>

    </main>
  );
}

export default Doctors;