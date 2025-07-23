
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

// Mock User type, similar to Firebase's but simplified
export interface MockUser {
  id: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock admin user for frontend development
const MOCK_ADMIN_USER: MockUser = {
  id: 'admin-user-id',
  email: 'aashish.gupta.mails@gmail.com',
  displayName: 'Admin User',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Default to being logged in as the admin user for easier development
  const [user, setUser] = useState<MockUser | null>(MOCK_ADMIN_USER);
  const [loading, setLoading] = useState(false); // No real auth, so no loading state needed initially
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(true); // Default to admin for development

  useEffect(() => {
    // In a real app, onAuthStateChanged would go here.
    // For now, we'll just manage the state locally.
    if (user) {
      setIsAdmin(user.email === MOCK_ADMIN_USER.email);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    console.log("Simulating sign up for:", { email, displayName });
    // In a real app, you would handle the referral code logic here.
    // For now, we'll just log it.
    const newUser: MockUser = { id: `user-${Date.now()}`, email, displayName };
    setUser(newUser);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log("Simulating sign in for:", email);
    // Simulate signing in the admin user for convenience
    if (email === MOCK_ADMIN_USER.email) {
        setUser(MOCK_ADMIN_USER);
    } else {
        setUser({ id: `user-${Date.now()}`, email, displayName: "Mock User" });
    }
    setLoading(false);
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    console.log("Simulating sign in with Google...");
    // Simulate a successful Google sign-in
    setUser({ id: 'google-user-id', email: 'google.user@example.com', displayName: 'Google User' });
    setLoading(false);
  }

  const signOut = async () => {
    setLoading(true);
    setError(null);
    console.log("Simulating sign out...");
    setUser(null);
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
