
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  type User 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = "aashish.gupta.mails@gmail.com";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // This function handles creating the user document in Firestore.
  const handleUserCreation = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    // If the user document doesn't exist, create it.
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        fullName: user.displayName || "User", // Fallback for display name
        email: user.email,
        phone: user.phoneNumber || "",
        upiId: "",
      }, { merge: true }); // Use merge to be safe
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // A user is logged in.
        setUser(user);
        setIsAdmin(user.email === ADMIN_EMAIL);
        // Ensure user document exists in Firestore.
        await handleUserCreation(user);
      } else {
        // No user is logged in.
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Handle the redirect result from Google Sign-In
    // This is useful to catch any errors during the redirect.
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Google sign-in redirect error:", error);
        setError(error.message);
      });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // After creating the user, update their profile with the display name.
      await updateProfile(userCredential.user, { displayName });
      // The onAuthStateChanged listener will handle the rest (setting user, creating doc).
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
       // onAuthStateChanged handles setting user state.
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      // Start the redirect process.
      await signInWithRedirect(auth, provider);
      // After redirect, onAuthStateChanged and getRedirectResult will handle the user.
    } catch (error: any) {
       setError(error.message);
       setLoading(false); // Only set loading false if there's an immediate error
    }
  }

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle clearing user state.
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAdmin,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
