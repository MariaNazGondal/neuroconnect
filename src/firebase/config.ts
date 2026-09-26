import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Default configuration with environment variables support
const fallbackConfig = {
  apiKey: "mock-key",
  authDomain: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319.firebaseapp.com",
  projectId: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319",
  storageBucket: "ai-studio-dc280f52-c547-4924-a8a1-b2284c215319.firebasestorage.app",
  messagingSenderId: "247598259796",
  appId: "1:247598259796:web:neuroconnect",
  firestoreDatabaseId: "(default)",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || fallbackConfig.firestoreDatabaseId || '(default)',
};

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connection verification required by skill instructions
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client currently appears offline or waiting for network.');
    }
    // We do not fail the app startup even if test doc does not exist
    return false;
  }
}

// Initial connection check on app load
testFirestoreConnection();
