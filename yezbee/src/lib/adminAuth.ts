import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const ADMIN_DOC_ID = 'main_admin';
const ADMIN_COLLECTION = 'admin_users';

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'sbfashionamazon@gmail.com',
  password: 'Sbmadu@1313',
  name: 'SB Fashion Admin',
  role: 'superadmin',
};

/**
 * Ensures a single Admin User ID & Password exists in Firebase Firestore database.
 * If not present or updated, seeds/syncs it into Firestore 'admin_users' collection.
 */
export async function initAdminUserInDB(): Promise<void> {
  try {
    const adminDocRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
    const snap = await getDoc(adminDocRef);

    if (!snap.exists()) {
      await setDoc(adminDocRef, {
        id: ADMIN_DOC_ID,
        email: DEFAULT_ADMIN_CREDENTIALS.email,
        password: DEFAULT_ADMIN_CREDENTIALS.password,
        name: DEFAULT_ADMIN_CREDENTIALS.name,
        role: DEFAULT_ADMIN_CREDENTIALS.role,
        createdAt: new Date().toISOString(),
      });
      console.log('Seeded strong admin user into Firebase Firestore database');
    } else {
      // Keep DB synced with active strong credentials
      await setDoc(
        adminDocRef,
        {
          email: DEFAULT_ADMIN_CREDENTIALS.email,
          password: DEFAULT_ADMIN_CREDENTIALS.password,
          name: DEFAULT_ADMIN_CREDENTIALS.name,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Failed to initialize admin user in database:', error);
  }
}

/**
 * Verifies email and password against the single Admin record in Firebase Firestore database.
 */
export async function verifyAdminLogin(
  email: string,
  pass: string
): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
  try {
    // Ensure DB record exists
    await initAdminUserInDB();

    const adminDocRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
    const snap = await getDoc(adminDocRef);

    if (!snap.exists()) {
      return { success: false, error: 'Admin record not found in database' };
    }

    const data = snap.data();
    const storedEmail = (data.email || '').toLowerCase().trim();
    const storedPassword = data.password || '';

    if (email.toLowerCase().trim() === storedEmail && pass === storedPassword) {
      const admin: AdminUser = {
        id: data.id || ADMIN_DOC_ID,
        email: data.email,
        name: data.name || 'YezBee Admin',
        role: data.role || 'superadmin',
        createdAt: data.createdAt,
      };
      return { success: true, admin };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error: any) {
    console.error('Error verifying admin login from database:', error);
    return { success: false, error: error.message || 'Database error verifying credentials' };
  }
}

/**
 * Update Admin Password in Firestore Database
 */
export async function updateAdminPasswordInDB(newPassword: string): Promise<boolean> {
  try {
    const adminDocRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
    await updateDoc(adminDocRef, {
      password: newPassword,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Failed to update admin password in database:', error);
    return false;
  }
}

/**
 * Admin Session Helpers using sessionStorage (and optional localStorage if Remember Me checked)
 */
const SESSION_KEY = 'yezbee_admin_session';

export function saveAdminSession(admin: AdminUser, remember: boolean = false) {
  if (typeof window !== 'undefined') {
    const payload = JSON.stringify({
      admin,
      loggedInAt: new Date().toISOString(),
    });
    // Always store in sessionStorage for current tab session
    sessionStorage.setItem(SESSION_KEY, payload);

    if (remember) {
      localStorage.setItem(SESSION_KEY, payload);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    // Check sessionStorage first for active tab session
    let sessionStr = sessionStorage.getItem(SESSION_KEY);
    
    // Fallback to localStorage only if remember was set
    if (!sessionStr) {
      sessionStr = localStorage.getItem(SESSION_KEY);
    }
    
    if (!sessionStr) return null;
    const data = JSON.parse(sessionStr);
    return data.admin || null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
}
