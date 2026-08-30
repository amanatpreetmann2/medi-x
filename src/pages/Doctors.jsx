import React, { useState } from "react";
import DoctorProfileModal from "../components/DoctorProfileModal";

import {
  Calendar,
  HeartPulse,
  Star,
  Stethoscope,
  Video
} from "lucide-react";

function Doctors({ onOpenBookAppointment, showToast }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics"
  ];

  const doctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      rating: "4.9",
      initials: "SJ",
      description:
        "Specializing in preventive cardiology and heart failure management with personalized care.",
      next: "Today",
      location: "Main Campus",
      experience: "14+ Years Experience",
      education: "MD, Johns Hopkins University • Fellowship at Mayo Clinic",
      languages: "English, Spanish"
    },

    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      rating: "4.8",
      initials: "MC",
      description:
        "Expert in movement disorders and neurodegenerative diseases with patient-centered care.",
      next: "Thu",
      location: "Telehealth",
      experience: "11+ Years Experience",
      education: "MD, Stanford School of Medicine • Neurology Residency UCSF",
      languages: "English, Mandarin"
    },

    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: "5.0",
      initials: "ER",
      description:
        "Dedicated to compassionate care for children from newborns to adolescents.",
      next: "Tomorrow",
      location: "Westside Clinic",
      experience: "9+ Years Experience",
      education: "MD, Columbia University • Pediatric Residency at Boston Children's",
      languages: "English, Spanish"
    },

    {
      name: "Dr. Robert Hayes",
      specialty: "Orthopedics",
      rating: "4.7",
      initials: "RH",
      description:
        "Focuses on sports injuries, joint replacement and minimally invasive procedures.",
      next: "Mon",
      location: "Main Campus",
      experience: "16+ Years Experience",
      education: "MD, Harvard Medical School • Orthopedic Fellowship HSS New York",
      languages: "English"
    }
  ];

  const filteredDoctors = selectedSpecialty === "All Specialties"
    ? doctors
    : doctors.filter(doc => doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase());

  const handleOpenProfile = (doc) => {
    setSelectedDoctor(doc);
    setIsProfileModalOpen(true);
  };

  const handleBookDoctor = (doc) => {
    if (onOpenBookAppointment) {
      onOpenBookAppointment(doc?.name || "Doctor");
    } else if (showToast) {
      showToast(`Opening scheduler for ${doc?.name || 'physician'}...`, "info");
    }
  };

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
        {specialties.map((spec) => (
          <button
            key={spec}
            className={selectedSpecialty === spec ? "specialty-active" : ""}
            onClick={() => setSelectedSpecialty(spec)}
          >
            {spec}
          </button>
        ))}
      </div>


      <div className="doctors-layout">

        {filteredDoctors.map(
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

                <button 
                  className="profile-btn"
                  onClick={() => handleOpenProfile(doctor)}
                >
                  View Profile
                </button>

                <button 
                  className="book-now-btn"
                  onClick={() => handleBookDoctor(doctor)}
                >
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

          <button
            onClick={() => {
              if (showToast) {
                showToast("Connecting with on-call urgent care telehealth physician... Estimated queue: 1 min", "info");
              }
            }}
          >

            <Video size={16} />

            Start Virtual Visit

          </button>

        </div>

      </div>

      {/* Interactive Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onBookNow={(doc) => handleBookDoctor(doc)}
      />

    </main>
  );
}

export default Doctors;