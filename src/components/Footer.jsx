import React from "react";
import MedixLogo from "./MedixLogo";

import {
  HeartPulse,
  Mail,
  Phone
} from "lucide-react";

function Footer({ setPage, onNavigateHome }) {
  const handleGoHome = () => {
    if (onNavigateHome) onNavigateHome();
    else if (setPage) setPage("Dashboard");
  };

  return (
    <footer className="portal-footer">

      <div className="footer-main">

        <div 
          className="footer-brand"
          onClick={handleGoHome}
          style={{ cursor: "pointer" }}
          title="Go to Dashboard"
        >

          <MedixLogo size={36} showText={false} darkTheme={true} />

          <div>

            <h3>Medix</h3>

            <p>
              Your health, our priority.
            </p>

          </div>

        </div>


        <div className="footer-section">

          <h4>Quick Links</h4>

          <span style={{ cursor: "pointer" }} onClick={() => setPage && setPage("Dashboard")}>Dashboard</span>
          <span style={{ cursor: "pointer" }} onClick={() => setPage && setPage("Appointments")}>Appointments</span>
          <span style={{ cursor: "pointer" }} onClick={() => setPage && setPage("Doctors")}>Doctors</span>
          <span style={{ cursor: "pointer" }} onClick={() => setPage && setPage("Reports")}>Reports</span>

        </div>


        <div className="footer-section">

          <h4>Patient Support</h4>

          <span>Help Center</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>FAQs</span>

        </div>


        <div className="footer-section">

          <h4>Contact</h4>

          <span>
            <Phone size={14} />
            +91 1800-123-456
          </span>

          <span>
            <Mail size={14} />
            support@medix.com
          </span>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Medix Health Portal.
          All rights reserved.
        </span>

        <span className="secure-text">

          <HeartPulse size={14} />

          Your health information is secure

        </span>

      </div>

    </footer>
  );
}

export default Footer;