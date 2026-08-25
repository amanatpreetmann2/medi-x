import React, { useState } from "react";

function Settings({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || "patient@medix.com");
  const [nameInput, setNameInput] = useState(user?.name || "");

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        email: emailInput,
        name: nameInput
      });
    }
    setIsEditing(false);
  };

  const userDisplay = user?.email || user?.name || "patient@medix.com";

  return (
    <main className="content">
      <h1 className="page-title">
        Settings
      </h1>

      <p className="page-subtitle">
        Manage your account and portal preferences.
      </p>

      <div className="simple-card">

        {/* Profile Information Row */}
        <div className="setting-row" style={{ alignItems: 'flex-start', padding: '24px 20px' }}>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '15px', display: 'block', marginBottom: '6px' }}>
              Profile Information
            </strong>

            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
                  {userDisplay}
                </span>
                {user?.name && user?.name !== user?.email && (
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Display Name: {user.name}
                  </span>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', maxWidth: '360px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="submit"
                    style={{ padding: '7px 16px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '7px 14px', background: 'white', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {!isEditing && (
            <button
              className="profile-btn"
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid var(--blue)',
                color: 'var(--blue)',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '38px',
                minWidth: '80px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Edit
            </button>
          )}
        </div>

        {/* Privacy & Security Row */}
        <div className="setting-row">
          <div>
            <strong>
              Privacy & Security
            </strong>
            <span>
              Manage your security preferences and password.
            </span>
          </div>
        </div>

        {/* Notifications Row */}
        <div className="setting-row">
          <div>
            <strong>
              Notifications
            </strong>
            <span>
              Manage email and portal notification preferences.
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Settings;