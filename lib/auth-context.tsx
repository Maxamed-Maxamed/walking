import { useRouter, useSegments } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

import type { Session, User } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'walker';

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  activeRole: UserRole | null;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Pure helper — returns the route to navigate to, or null if no redirect needed. */
function resolveRoute(
  session: Session | null,
  activeRole: UserRole | null,
  inAuthGroup: boolean,
): string | null {
  if (!session) return inAuthGroup ? null : '/(auth)/role-select';
  if (!inAuthGroup) return null;
  if (activeRole === 'owner') return '/(owner)/(tabs)';
  if (activeRole === 'walker') return '/(walker)/(tabs)/jobs';
  return null;
}

async function fetchProfile(user: User): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, bio, location')
    .eq('id', user.id)
    .single();
  if (error) return null;
  return data as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileRequestIdRef = useRef(0);

  const router = useRouter();
  const segments = useSegments();

  function applySession(newSession: Session | null, prevUserId?: string | null) {
    const newUserId = newSession?.user.id ?? null;
    // Clear role state when identity changes (sign-out or different account)
    if (newUserId !== prevUserId) {
      setRoles([]);
      setActiveRole(null);
      setProfile(null);
    }
    setSession(newSession);
    const requestId = ++profileRequestIdRef.current;
    if (newSession?.user) {
      fetchProfile(newSession.user)
        .then((p) => { if (profileRequestIdRef.current === requestId) setProfile(p); })
        .catch(() => { if (profileRequestIdRef.current === requestId) setProfile(null); });
    }
  }

  useEffect(() => {
    let currentUserId: string | null = null;

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        currentUserId = s?.user.id ?? null;
        applySession(s, null);
        setIsLoading(false);
      })
      .catch(() => {
        applySession(null, null);
        setIsLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      applySession(s, currentUserId);
      currentUserId = s?.user.id ?? null;
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const route = resolveRoute(session, activeRole, segments[0] === '(auth)');
    if (route) router.replace(route as Parameters<typeof router.replace>[0]);
  }, [session, segments, isLoading, activeRole, router]);

  const switchRole = useCallback((role: UserRole) => {
    setActiveRole(role);
    setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, roles, activeRole, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
