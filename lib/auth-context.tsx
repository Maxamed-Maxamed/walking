import { useRouter, useSegments } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

import type { Session, User } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'walker';
const ONBOARDING_COMPLETED_KEY = 'dogwalker:onboarding_completed';

/** Safely parse a route param (string | string[] | undefined) into a UserRole. */
export function parseUserRole(value: string | string[] | undefined): UserRole | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'owner' || raw === 'walker') return raw;
  return null;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  onboarding_completed: boolean;
}

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  activeRole: UserRole | null;
  onboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Pure helper — returns the route to navigate to, or null if no redirect needed. */
function resolveRoute(
  session: Session | null,
  activeRole: UserRole | null,
  onboardingCompleted: boolean,
  inAuthGroup: boolean,
  inOnboardingGroup: boolean,
  inOwnerGroup: boolean,
  inWalkerGroup: boolean,
): string | null {
  if (!onboardingCompleted) return inOnboardingGroup ? null : '/(onboarding)';
  if (!session) return inAuthGroup ? null : '/(auth)/role-select';
  if (activeRole === 'owner') return inOwnerGroup ? null : '/(owner)/(tabs)';
  if (activeRole === 'walker') return inWalkerGroup ? null : '/(walker)/(tabs)/jobs';
  return inAuthGroup ? null : '/(auth)/role-select';
}

async function fetchProfile(user: User): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, bio, location, onboarding_completed')
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
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const profileRequestIdRef = useRef(0);

  const router = useRouter();
  const segments = useSegments();
  const isLoading = isAuthLoading || isOnboardingLoading;

  function runProfileFetch(user: User) {
    const requestId = ++profileRequestIdRef.current;
    fetchProfile(user)
      .then((p) => { if (profileRequestIdRef.current === requestId) setProfile(p); })
      .catch(() => { if (profileRequestIdRef.current === requestId) setProfile(null); });
  }

  function applySession(newSession: Session | null, prevUserId?: string | null) {
    const newUserId = newSession?.user.id ?? null;
    // Clear role state when identity changes (sign-out or different account)
    if (newUserId !== prevUserId) {
      setRoles([]);
      setActiveRole(null);
      setProfile(null);
    }
    setSession(newSession);
    if (newSession?.user) runProfileFetch(newSession.user);
  }

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
      .then((value) => {
        if (!active) return;
        setOnboardingCompleted(value === 'true');
        setIsOnboardingLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setOnboardingCompleted(false);
        setIsOnboardingLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let currentUserId: string | null = null;

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        currentUserId = s?.user.id ?? null;
        applySession(s, null);
        setIsAuthLoading(false);
      })
      .catch(() => {
        applySession(null, null);
        setIsAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      applySession(s, currentUserId);
      currentUserId = s?.user.id ?? null;
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const topSegment = (segments[0] ?? '') as string;
    const inAuthGroup = topSegment === '(auth)';
    const inOnboardingGroup = topSegment === '(onboarding)';
    const inOwnerGroup = topSegment === '(owner)';
    const inWalkerGroup = topSegment === '(walker)';
    const route = resolveRoute(
      session,
      activeRole,
      onboardingCompleted,
      inAuthGroup,
      inOnboardingGroup,
      inOwnerGroup,
      inWalkerGroup,
    );
    if (route) router.replace(route as Parameters<typeof router.replace>[0]);
  }, [session, segments, isLoading, activeRole, onboardingCompleted, router]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setOnboardingCompleted(true);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setActiveRole(role);
    setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        roles,
        activeRole,
        onboardingCompleted,
        completeOnboarding,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
