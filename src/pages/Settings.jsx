import React from "react";

function Settings() {

  return (
    <main className="content">

      <h1 className="page-title">
        Settings
      </h1>

      <p className="page-subtitle">
        Manage your account and portal preferences.
      </p>


      <div className="simple-card">

        <div className="setting-row">

          <div>

            <strong>
              Profile Information
            </strong>

            <span>
              Sarah Jenkins
            </span>

          </div>

          <button className="profile-btn">
            Edit
          </button>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              Privacy & Security
            </strong>

            <span>
              Manage your security preferences.
            </span>

          </div>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              Notifications
            </strong>

            <span>
              Manage notification preferences.
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Settings;