import React from "react";

import {
  CircleHelp,
  Mail,
  LifeBuoy
} from "lucide-react";
import PageHeader from "../components/PageHeader";

function Support() {

  return (
    <main className="content">
      <PageHeader
        badge="Help & Customer Service"
        badgeIcon={LifeBuoy}
        title="Support & Assistance"
        subtitle="Need help navigating your portal or accessing care? Our healthcare support team is here to assist you."
      />

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