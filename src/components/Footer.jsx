import React from "react";

import {
  HeartPulse,
  Mail,
  Phone
} from "lucide-react";

function Footer() {

  return (
    <footer className="portal-footer">

      <div className="footer-main">

        <div className="footer-brand">

          <div className="footer-logo">
            +
          </div>

          <div>

            <h3>Medix</h3>

            <p>
              Your health, our priority.
            </p>

          </div>

        </div>


        <div className="footer-section">

          <h4>Quick Links</h4>

          <span>Dashboard</span>
          <span>Appointments</span>
          <span>Doctors</span>
          <span>Reports</span>

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