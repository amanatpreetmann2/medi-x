import React from "react";

import {
  CircleHelp,
  Mail
} from "lucide-react";

function Support() {

  return (
    <main className="content">

      <h1 className="page-title">
        Support
      </h1>

      <p className="page-subtitle">
        Need help? We're here to assist you.
      </p>


      <div className="support-grid">

        <div className="support-card">

          <CircleHelp size={30} />

          <h3>
            Help Center
          </h3>

          <p>
            Find answers to common questions about
            your health portal.
          </p>

          <button>
            View Help Center
          </button>

        </div>


        <div className="support-card">

          <Mail size={30} />

          <h3>
            Contact Support
          </h3>

          <p>
            Contact our support team for assistance.
          </p>

          <button>
            Contact Us
          </button>

        </div>

      </div>

    </main>
  );
}

export default Support;