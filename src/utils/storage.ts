import { BirthProfile, UserAccount } from '../types';

const STORAGE_KEYS = {
  AGE_VERIFIED: 'labruja_age_verified',
  BIRTH_PROFILE: 'labruja_birth_profile',
  BETA_EMAIL: 'labruja_beta_subscriber',
  SAVED_READING_PHASE: 'labruja_selected_phase',
  CURRENT_USER: 'labruja_current_user',
  REGISTERED_USERS: 'labruja_users_db'
};

interface StoredUserCredential {
  user: UserAccount;
  passwordHash: string;
}

const DEMO_USER: StoredUserCredential = {
  user: {
    id: 'usr_demo_oaxaca',
    name: 'Mateo Sandoval',
    email: 'copita@labruja.app',
    birthDate: '1995-10-28',
    birthplace: 'Oaxaca de Juárez, Mexico',
    createdAt: Date.now() - 86400000 * 30,
    savedFavorites: ['espadin', 'tepeztate']
  },
  passwordHash: 'agave123'
};

function getStoredCredentials(): StoredUserCredential[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      const initial = [DEMO_USER];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

function saveStoredCredentials(credentials: StoredUserCredential[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(credentials));
  } catch {
    // ignore
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch {
    // ignore
  }
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  birthDate?: string,
  birthplace?: string
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!name.trim()) {
    return { success: false, error: 'Please provide your name or palenquero moniker.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const allUsers = getStoredCredentials();
  const exists = allUsers.some((u) => u.user.email.toLowerCase() === cleanEmail);
  if (exists) {
    return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: cleanEmail,
    birthDate: birthDate || undefined,
    birthplace: birthplace || undefined,
    createdAt: Date.now(),
    savedFavorites: ['espadin']
  };

  allUsers.push({
    user: newUser,
    passwordHash: password
  });

  saveStoredCredentials(allUsers);
  setCurrentUser(newUser);

  // If user provided birth info during signup, also update birth profile
  if (birthDate) {
    const existingProfile = getSavedBirthProfile();
    const newProfile: BirthProfile = {
      birthDate,
      birthTime: existingProfile?.birthTime || '20:45',
      birthplace: birthplace || 'Oaxaca de Juárez, Mexico',
      latitude: existingProfile?.latitude || 17.0732,
      longitude: existingProfile?.longitude || -96.7266,
      timeZone: existingProfile?.timeZone || 'America/Mexico_City',
      consentTimestamp: Date.now()
    };
    saveBirthProfile(newProfile);
  }

  return { success: true, user: newUser };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getStoredCredentials();
  const match = allUsers.find((u) => u.user.email.toLowerCase() === cleanEmail);

  if (!match) {
    return { success: false, error: 'No celestial account found with this email. Please check or sign up.' };
  }

  if (match.passwordHash !== password) {
    return { success: false, error: 'Incorrect password for this account. Try again.' };
  }

  setCurrentUser(match.user);
  return { success: true, user: match.user };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function getAgeVerified(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED) === 'true';
  } catch {
    return false;
  }
}

export function setAgeVerified(verified: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, verified ? 'true' : 'false');
  } catch {
    // ignore local storage restrictions
  }
}

export function getSavedBirthProfile(): BirthProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIRTH_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveBirthProfile(profile: BirthProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BIRTH_PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearBirthProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BIRTH_PROFILE);
  } catch {
    // ignore
  }
}

export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.AGE_VERIFIED);
    localStorage.removeItem(STORAGE_KEYS.BIRTH_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.BETA_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.SAVED_READING_PHASE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch {
    // ignore
  }
}

export function getSavedBetaEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.BETA_EMAIL);
  } catch {
    return null;
  }
}

export function saveBetaEmail(email: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BETA_EMAIL, email);
  } catch {
    // ignore
  }
}
