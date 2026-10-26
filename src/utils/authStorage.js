/**
 * Medix Healthcare Portal - Authentication & LocalStorage Manager
 * Handles user sessions, remembered credentials, real email validation,
 * account persistence, and Google authentication.
 */

const STORAGE_KEY_AUTH = 'medix_auth_session';
const STORAGE_KEY_REMEMBER = 'medix_remembered_credentials';
const STORAGE_KEY_ACCOUNTS = 'medix_registered_accounts';

// Seed demo & preconfigured accounts
const DEFAULT_ACCOUNTS = [
  {
    email: 'kabir.patel@medix.com',
    password: 'MedixPatient2026!',
    name: 'Kabir Patel',
    role: 'Patient',
    patientId: 'MX-1001',
    bloodGroup: 'B+',
    avatar: null,
    provider: 'local',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    email: 'patient@medix.com',
    password: 'MedixPatient2026!',
    name: 'Kabir Patel',
    role: 'Patient',
    patientId: 'MX-1001',
    bloodGroup: 'B+',
    avatar: null,
    provider: 'local',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    email: 'ananya.singh@medix.com',
    password: 'MedixPatient2026!',
    name: 'Ananya Singh',
    role: 'Patient',
    patientId: 'MX-1002',
    bloodGroup: 'O+',
    avatar: null,
    provider: 'local',
    createdAt: '2026-02-10T11:30:00Z'
  },
  {
    email: 'rahul.mehta@medix.com',
    password: 'MedixPatient2026!',
    name: 'Rahul Mehta',
    role: 'Patient',
    patientId: 'MX-1003',
    bloodGroup: 'AB+',
    avatar: null,
    provider: 'local',
    createdAt: '2026-02-18T14:00:00Z'
  }
];

/**
 * Generate a deterministic medical Patient ID based on email string
 */
export function generatePatientId(email = '') {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 9000 + 1000;
  return `MX-${positive}`;
}

/**
 * Derive human-friendly display name from email (e.g. john.doe@gmail.com -> John Doe)
 */
export function formatDisplayName(email = '', customName = '') {
  if (customName && customName.trim()) {
    return customName.trim();
  }
  if (!email || !email.includes('@')) {
    return 'Patient';
  }
  const prefix = email.split('@')[0];
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Validates real email address structure using standard RFC 5322 regex
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
}

/**
 * Retrieve active auth session from localStorage
 */
export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return { isLoggedIn: false, user: null };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.isLoggedIn && parsed.user) {
      // Auto-migrate legacy patient session names if present
      let migrated = false;
      if (parsed.user.patientId === 'MX-1001' && (parsed.user.name === 'Sarah Jenkins' || parsed.user.name === 'Kapir Patel' || parsed.user.email === 'sarah.jenkins@medix.com' || parsed.user.email === 'kapir.patel@medix.com')) {
        parsed.user.name = 'Kabir Patel';
        parsed.user.email = 'kabir.patel@medix.com';
        parsed.user.bloodGroup = 'B+';
        migrated = true;
      } else if (parsed.user.patientId === 'MX-1002' && (parsed.user.name === 'Marcus Vance' || parsed.user.email === 'marcus.vance@medix.com')) {
        parsed.user.name = 'Ananya Singh';
        parsed.user.email = 'ananya.singh@medix.com';
        parsed.user.bloodGroup = 'O+';
        migrated = true;
      } else if (parsed.user.patientId === 'MX-1003' && (parsed.user.name === 'Elena Rostova' || parsed.user.email === 'elena.rostova@medix.com')) {
        parsed.user.name = 'Rahul Mehta';
        parsed.user.email = 'rahul.mehta@medix.com';
        parsed.user.bloodGroup = 'AB+';
        migrated = true;
      }
      if (migrated) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(parsed));
      }
      return parsed;
    }
    return { isLoggedIn: false, user: null };
  } catch (err) {
    console.error('Error reading auth session from localStorage:', err);
    return { isLoggedIn: false, user: null };
  }
}

/**
 * Save active auth session to localStorage
 */
export function setStoredAuth(user) {
  try {
    const payload = {
      isLoggedIn: true,
      user,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving auth session to localStorage:', err);
  }
}

/**
 * Clear active auth session (Log out)
 */
export function clearStoredAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  } catch (err) {
    console.error('Error clearing auth session:', err);
  }
}

/**
 * Retrieve remembered login credentials (email, password, rememberMe)
 */
export function getRememberedCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMEMBER);
    if (!raw) {
      return {
        email: '',
        password: '',
        rememberMe: true
      };
    }
    const parsed = JSON.parse(raw);
    let email = parsed.email || '';
    if (email === 'sarah.jenkins@medix.com' || email === 'kapir.patel@medix.com') email = 'kabir.patel@medix.com';
    if (email === 'marcus.vance@medix.com') email = 'ananya.singh@medix.com';
    if (email === 'elena.rostova@medix.com') email = 'rahul.mehta@medix.com';

    return {
      email,
      password: parsed.password || '',
      rememberMe: parsed.rememberMe !== false
    };
  } catch (err) {
    console.error('Error reading remembered credentials:', err);
    return { email: '', password: '', rememberMe: true };
  }
}

/**
 * Save or clear remembered login credentials based on rememberMe flag
 */
export function saveRememberedCredentials({ email, password, rememberMe }) {
  try {
    if (rememberMe) {
      localStorage.setItem(
        STORAGE_KEY_REMEMBER,
        JSON.stringify({
          email: (email || '').trim(),
          password: password || '',
          rememberMe: true,
          savedAt: new Date().toISOString()
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER);
    }
  } catch (err) {
    console.error('Error saving remembered credentials:', err);
  }
}

/**
 * Get all registered accounts in localStorage
 */
export function getRegisteredAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }

    let needsUpdate = false;
    parsed = parsed.map(acc => {
      if (acc.patientId === 'MX-1001' && (acc.name === 'Sarah Jenkins' || acc.name === 'Kapir Patel' || acc.email === 'sarah.jenkins@medix.com' || acc.email === 'kapir.patel@medix.com')) {
        needsUpdate = true;
        return { ...acc, name: 'Kabir Patel', email: 'kabir.patel@medix.com', bloodGroup: 'B+' };
      }
      if (acc.patientId === 'MX-1002' && (acc.name === 'Marcus Vance' || acc.email === 'marcus.vance@medix.com')) {
        needsUpdate = true;
        return { ...acc, name: 'Ananya Singh', email: 'ananya.singh@medix.com', bloodGroup: 'O+' };
      }
      if (acc.patientId === 'MX-1003' && (acc.name === 'Elena Rostova' || acc.email === 'elena.rostova@medix.com')) {
        needsUpdate = true;
        return { ...acc, name: 'Rahul Mehta', email: 'rahul.mehta@medix.com', bloodGroup: 'AB+' };
      }
      return acc;
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Error reading registered accounts:', err);
    return DEFAULT_ACCOUNTS;
  }
}

/**
 * Register a new user or update an existing registered user
 */
export function saveRegisteredAccount(user) {
  try {
    const accounts = getRegisteredAccounts();
    const existingIndex = accounts.findIndex(
      acc => acc.email.toLowerCase() === user.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      accounts[existingIndex] = {
        ...accounts[existingIndex],
        ...user,
        updatedAt: new Date().toISOString()
      };
    } else {
      accounts.push({
        ...user,
        createdAt: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    return accounts;
  } catch (err) {
    console.error('Error saving account to localStorage:', err);
    return [];
  }
}

/**
 * Authenticate user with Email & Password
 * Supports both pre-existing accounts and registration of new real emails
 */
export function authenticateWithEmail({ email, password, rememberMe, name }) {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  const found = accounts.find(acc => acc.email.toLowerCase() === cleanEmail);

  let user;
  if (found) {
    // If account exists, update password if new password was provided
    user = {
      ...found,
      name: name?.trim() || found.name || formatDisplayName(cleanEmail),
      lastLogin: new Date().toISOString()
    };
    if (password) {
      user.password = password;
    }
  } else {
    // Register new real email account seamlessly
    user = {
      email: cleanEmail,
      password: password || '',
      name: name?.trim() || formatDisplayName(cleanEmail),
      role: 'Patient',
      patientId: generatePatientId(cleanEmail),
      bloodGroup: 'B+',
      avatar: null,
      provider: 'local',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
  }

  // Persist account in database
  saveRegisteredAccount(user);

  // Remember credentials if requested
  saveRememberedCredentials({
    email: cleanEmail,
    password: password || '',
    rememberMe
  });

  // Store active session
  setStoredAuth(user);

  return user;
}

/**
 * Authenticate user with Google Account
 */
export function authenticateWithGoogle({ email, name, avatar, googleId }) {
  const cleanEmail = (email || 'user@gmail.com').trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  const found = accounts.find(acc => acc.email.toLowerCase() === cleanEmail);

  const displayName = name || formatDisplayName(cleanEmail);
  const patientId = found?.patientId || generatePatientId(cleanEmail);

  const user = {
    ...(found || {}),
    email: cleanEmail,
    name: displayName,
    avatar: avatar || null,
    provider: 'google',
    googleId: googleId || `g_${Date.now()}`,
    role: found?.role || 'Patient',
    patientId: patientId,
    lastLogin: new Date().toISOString()
  };

  saveRegisteredAccount(user);

  // Remember email for future visits
  saveRememberedCredentials({
    email: cleanEmail,
    password: '',
    rememberMe: true
  });

  setStoredAuth(user);

  return user;
}
