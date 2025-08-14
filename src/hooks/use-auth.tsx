
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User as AppUser } from '@/lib/types';


interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateAppUser: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'aashish.gupta.mails@gmail.com';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if(firebaseUser) {
            setUser(firebaseUser);
            setIsAdmin(firebaseUser.email === ADMIN_EMAIL);
            
            // fetch app user data from firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setAppUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
            } else {
                // if user exists in auth but not firestore, create it
                const newUser: AppUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    fullName: firebaseUser.displayName || "",
                    phone: "",
                    upiId: ""
                }
                await setDoc(userDocRef, { ...newUser, createdAt: serverTimestamp() });
                setAppUser(newUser);
            }

        } else {
            setUser(null);
            setAppUser(null);
            setIsAdmin(false);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateAppUser = async (data: Partial<AppUser>) => {
      if (!user) return;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
      setAppUser(prev => prev ? { ...prev, ...data } : null);
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        const newUser: AppUser = {
            id: userCredential.user.uid,
            email,
            fullName,
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...newUser,
            createdAt: serverTimestamp()
        });

    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle the rest
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  }

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
        await firebaseSignOut(auth);
    } catch(e: any) {
        setError(e.message)
    } finally {
        setLoading(false);
    }
  };

  const value = {
    user,
    appUser,
    loading,
    error,
    isAdmin,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateAppUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
