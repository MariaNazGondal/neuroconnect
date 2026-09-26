import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  preferredLanguage: string;
  kommune: string;
  bio?: string;
  optInConnect?: boolean;
  childAgeGroup?: '0-5' | '6-12' | '13+';
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  lowSensoryMode: boolean;
  toggleLowSensoryMode: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, kommune: string, lang: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  loginAsGuestDemo: (kommune?: string, lang?: string, customName?: string, customEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createDefaultParentProfile = (overrides?: Partial<UserProfileData>): UserProfileData => ({
  uid: 'parent-' + Math.random().toString(36).substring(2, 9),
  displayName: 'Parent in Denmark 🌻',
  email: 'parent@community.autismdk.org',
  preferredLanguage: 'en',
  kommune: 'København',
  optInConnect: true,
  bio: 'Parent navigating autism and special needs in Denmark.',
  childAgeGroup: '6-12',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const getSavedLocalProfile = (): UserProfileData => {
  try {
    const saved = localStorage.getItem('autismdk_user_profile') || sessionStorage.getItem('neuroconnect_demo_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.displayName) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse saved local profile:', e);
  }
  const initial = createDefaultParentProfile();
  try {
    localStorage.setItem('autismdk_user_profile', JSON.stringify(initial));
  } catch {
    // ignore storage quota issues
  }
  return initial;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData>(getSavedLocalProfile);
  const [loading, setLoading] = useState(false);
  const [lowSensoryMode, setLowSensoryMode] = useState<boolean>(() => {
    return localStorage.getItem('neuroconnect_sensory_mode') === 'true';
  });

  const toggleLowSensoryMode = () => {
    setLowSensoryMode(prev => {
      const next = !prev;
      localStorage.setItem('neuroconnect_sensory_mode', String(next));
      if (next) {
        document.body.classList.add('low-sensory-mode');
      } else {
        document.body.classList.remove('low-sensory-mode');
      }
      return next;
    });
  };

  useEffect(() => {
    if (lowSensoryMode) {
      document.body.classList.add('low-sensory-mode');
    }
  }, [lowSensoryMode]);

  // Sync Firebase auth state if available, but never block or wipe the local profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadOrCreateUserProfile(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadOrCreateUserProfile = async (firebaseUser: User, extraDetails?: { kommune?: string; lang?: string }) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setProfile(snap.data() as UserProfileData);
      } else {
        // Create initial profile
        const newProfile: UserProfileData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Special Needs Parent',
          email: firebaseUser.email || `${firebaseUser.uid}@autismdk.org`,
          preferredLanguage: extraDetails?.lang || 'en',
          kommune: extraDetails?.kommune || 'København',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      // In offline or initial setup mode, construct fallback local state
      console.warn('Could not load user profile from Firestore, using local auth details:', error);
      const fallback: UserProfileData = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Parent',
        email: firebaseUser.email || '',
        preferredLanguage: extraDetails?.lang || 'en',
        kommune: extraDetails?.kommune || 'København',
        createdAt: new Date().toISOString(),
      };
      setProfile(fallback);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const cred = await signInWithPopup(auth, provider);
      await loadOrCreateUserProfile(cred.user);
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await loadOrCreateUserProfile(cred.user);
    } catch (error: any) {
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        console.warn('Firebase Email/Password provider not enabled in console, logging in as local parent session');
        const fallbackProfile: UserProfileData = {
          uid: `parent-${Date.now()}`,
          displayName: email.split('@')[0] || 'Special Needs Parent',
          email: email,
          preferredLanguage: 'en',
          kommune: 'København',
          optInConnect: true,
          bio: 'Parent in Denmark navigating special needs and PPR resources.',
          createdAt: new Date().toISOString(),
        };
        sessionStorage.setItem('neuroconnect_demo_user', JSON.stringify(fallbackProfile));
        setProfile(fallbackProfile);
        return;
      }
      console.error('Email sign in failed:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    kommune: string, 
    lang: string
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      
      const newProfile: UserProfileData = {
        uid: cred.user.uid,
        displayName: name,
        email: email,
        preferredLanguage: lang,
        kommune: kommune,
        optInConnect: true,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
      }
      setProfile(newProfile);
    } catch (error: any) {
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        console.warn('Firebase Email/Password provider not enabled in console, activating instant parent profile session');
        const fallbackProfile: UserProfileData = {
          uid: `parent-${Date.now()}`,
          displayName: name || 'Special Needs Parent',
          email: email,
          preferredLanguage: lang,
          kommune: kommune,
          optInConnect: true,
          bio: `Parent from ${kommune} connecting with local special needs community.`,
          createdAt: new Date().toISOString(),
        };
        sessionStorage.setItem('neuroconnect_demo_user', JSON.stringify(fallbackProfile));
        setProfile(fallbackProfile);
        return;
      }
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!profile) return;
    const updated: UserProfileData = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (user) {
      try {
        await setDoc(doc(db, 'users', profile.uid), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${profile.uid}`);
      }
    }
    
    // Always persist to local browser storage so the parent never loses their settings
    try {
      localStorage.setItem('autismdk_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setProfile(updated);
  };

  const loginAsGuestDemo = async (
    kommune: string = 'København', 
    lang: string = 'en',
    customName?: string,
    customEmail?: string
  ) => {
    const demoProfile: UserProfileData = createDefaultParentProfile({
      displayName: customName || 'Parent in Denmark 🌻',
      email: customEmail || 'parent@community.autismdk.org',
      preferredLanguage: lang,
      kommune: kommune,
      bio: `Parent connecting from ${kommune}. Here for peer advice and special needs resources.`,
    });
    try {
      localStorage.setItem('autismdk_user_profile', JSON.stringify(demoProfile));
    } catch {
      // ignore
    }
    setProfile(demoProfile);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('autismdk_user_profile');
      sessionStorage.removeItem('neuroconnect_demo_user');
    } catch {
      // ignore
    }
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
    }
    // Generate fresh local parent session so the user never encounters broken pages or blocked UI
    const fresh = createDefaultParentProfile();
    try {
      localStorage.setItem('autismdk_user_profile', JSON.stringify(fresh));
    } catch {
      // ignore
    }
    setProfile(fresh);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      lowSensoryMode,
      toggleLowSensoryMode,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      updateUserProfile,
      loginAsGuestDemo,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
