"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getCurrentUser, onAuthStateChange, signIn, signUp, signOut } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; needsConfirmation: boolean; error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Get initial user with short timeout
    const initAuth = async () => {
      try {
        // Short timeout to prevent blocking
        const timeoutPromise = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 2000); // 2 second timeout
        });
        
        const userPromise = getCurrentUser();
        const result = await Promise.race([userPromise, timeoutPromise]);
        
        if (mounted) {
          setUser(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    initAuth();

    // Listen for auth changes - this will update user if auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return { error: result.error };
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const result = await signUp(email, password, name);
    return { success: result.success, needsConfirmation: result.needsConfirmation, error: result.error };
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
