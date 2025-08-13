
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';

// A mock user type that is compatible with the old FirebaseUser but simplified
export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate initial auth state check
    setLoading(false);
  }, []);

  const setMockUser = (mockUser: { id: string, email: string, fullName: string }) => {
      const authUser: AuthUser = {
          uid: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.fullName
      };
      setUser(authUser);
      setIsAdmin(authUser.email === ADMIN_EMAIL);
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    console.log("Mock SignUp:", { email, password, displayName });
    // Simulate successful signup and login
    const newUserId = `user-${Date.now()}`;
    MOCK_USERS[newUserId] = {
        id: newUserId,
        email: email,
        fullName: displayName,
        phone: '',
        upiId: ''
    };
    setMockUser(MOCK_USERS[newUserId]);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log("Mock SignIn:", { email, password });
    
    // Simple mock logic: Find user by email
    const existingUser = Object.values(MOCK_USERS).find(u => u.email === email);
    
    if (existingUser) {
      setMockUser(existingUser);
    } else {
      setError("Mock Auth: User not found.");
    }
    setLoading(false);
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    console.log("Mock SignInWithGoogle");
    // Sign in with a predefined google user for simplicity
    setMockUser(MOCK_USERS['google-user-id']);
    setLoading(false);
  }

  const signOut = async () => {
    setLoading(true);
    setError(null);
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
