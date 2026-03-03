import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import type { Session } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'walker';

interface AuthContextType {
  session: Session | null;
  roles: UserRole[];
  activeRole: UserRole | null;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      if (activeRole === 'owner') {
        router.replace('/(owner)/(tabs)');
      } else if (activeRole === 'walker') {
        router.replace('/(walker)/(tabs)/jobs');
      }
      // no activeRole → stay on role-select
    }
  }, [session, segments, isLoading, activeRole]);

  function switchRole(role: UserRole) {
    setActiveRole(role);
    setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
  }

  return (
    <AuthContext.Provider value={{ session, roles, activeRole, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
