
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
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

  const handleUserCreation = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        fullName: user.displayName,
        email: user.email,
        phone: "",
        upiId: "",
      });
    }
  }

  useEffect(() => {
    const processRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          // This will trigger the onAuthStateChanged listener below.
          await handleUserCreation(result.user);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        // This ensures loading is only set to false after checking for a redirect.
        setLoading(false);
      }
    };
    
    processRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Don't set loading to false here immediately, 
      // let the redirect handler do it.
      if (!loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser(userCredential.user);
        await handleUserCreation(userCredential.user);
      }
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
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Use signInWithRedirect for a more robust web flow
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
       setError(error.message);
       setLoading(false); // Only set loading to false if there's an immediate error
    }
  }

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null); // Explicitly set user to null on sign out
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
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
