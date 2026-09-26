import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Safely discover local firebase-applet-config.json if provided, without breaking builds if absent
const localConfigs = import.meta.glob('/firebase-applet-config.json', { eager: true });
const localConfig = (localConfigs['/firebase-applet-config.json'] as { default?: Record<string, string> })?.default || {};

// Project fallback configuration matching Google Cloud project
const fallbackConfig = {
  apiKey: "mock-key",
  authDomain: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319.firebaseapp.com",
  projectId: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319",
  storageBucket: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319.firebasestorage.app",
  messagingSenderId: "247598259796",
  appId: "1:247598259796:web:autismdk",
  firestoreDatabaseId: "(default)",
};

// Priority mapping: Environment Variables -> local config file -> fallback defaults
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || fallbackConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || fallbackConfig.firestoreDatabaseId || '(default)',
};

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth & configure localized emails
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Connection verification helper (silent when operating in local or offline mode)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    // Graceful offline/local mode fallback without console warning spam
    return false;
  }
}
