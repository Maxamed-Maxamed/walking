import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  profile: any;
  roles: string[];
  activeRole: string | null;
  onboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  switchRole: (role: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const contextValue: AuthContextType = {
    session: null,
    profile: null,
    roles: [],
    activeRole: null,
    onboardingCompleted: false,
    completeOnboarding: async () => {},
    switchRole: (role: string) => void 0,
    isLoading: false,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export types and helper functions
export type { Session } from '@supabase/supabase-js';
export type { UserRole } from './auth-types';
export { parseUserRole } from './auth-types';