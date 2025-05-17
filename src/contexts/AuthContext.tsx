import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth, supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for session on initial load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const { user: currentUser } = await auth.getCurrentUser();
      setUser(currentUser as User | null);
      setIsLoading(false);
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as User);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      const { error } = await auth.signIn(email, password);
      return { error };
    },
    signUp: async (email: string, password: string) => {
      const { error } = await auth.signUp(email, password);
      return { error };
    },
    signOut: async () => {
      const { error } = await auth.signOut();
      return { error };
    },
    resetPassword: async (email: string) => {
      const { error } = await auth.resetPassword(email);
      return { error };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
