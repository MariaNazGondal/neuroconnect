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
  loginAsGuestDemo: (kommune?: string, lang?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadOrCreateUserProfile(currentUser);
      } else {
        // Check if demo user is stored in session
        const cachedDemo = sessionStorage.getItem('neuroconnect_demo_user');
        if (cachedDemo) {
          try {
            setProfile(JSON.parse(cachedDemo));
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
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
          email: firebaseUser.email || `${firebaseUser.uid}@neuroconnect.dk`,
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
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
      }
      setProfile(newProfile);
    } catch (error: any) {
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
    } else {
      // Demo mode session update
      sessionStorage.setItem('neuroconnect_demo_user', JSON.stringify(updated));
    }
    setProfile(updated);
  };

  const loginAsGuestDemo = async (kommune: string = 'København', lang: string = 'en') => {
    const demoProfile: UserProfileData = {
      uid: 'guest-parent-demo',
      displayName: 'Guest Parent (Denmark)',
      email: 'guest.parent@example.com',
      preferredLanguage: lang,
      kommune: kommune,
      bio: 'Parent of a 6-year-old child on the autism spectrum in Denmark. Connecting with other families.',
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem('neuroconnect_demo_user', JSON.stringify(demoProfile));
    setProfile(demoProfile);
  };

  const logout = async () => {
    sessionStorage.removeItem('neuroconnect_demo_user');
    setProfile(null);
    if (auth.currentUser) {
      await signOut(auth);
    }
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
