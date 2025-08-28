
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout, proceeding without authentication');
      setLoading(false);
    }, 5000); // 5 second timeout

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        clearTimeout(timeout); // Clear timeout since we got a response
        setSession(session);
        if (session?.user) {
          const appUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      clearTimeout(timeout);
      // Fallback: set loading to false so app doesn't hang
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    session,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
