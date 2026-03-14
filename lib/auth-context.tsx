import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect } from 'react';
import { parseUserRole, type UserProfile, type UserRole } from '@/lib/auth-types';
import { useAuthState } from '@/lib/use-auth-state';
import type { Session } from '@supabase/supabase-js';

export type { UserProfile, UserRole };
export { parseUserRole };

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

function resolveRoute(
  session: Session | null,
  activeRole: UserRole | null,
  onboardingCompleted: boolean,
  inAuthGroup: boolean,
  inOnboardingGroup: boolean,
  inOwnerGroup: boolean,
  inWalkerGroup: boolean,
): string | null {
  let targetRoute: string;
  let isInPlace: boolean;
  if (!onboardingCompleted) {
    targetRoute = '/(onboarding)';
    isInPlace = inOnboardingGroup;
  } else if (!session) {
    targetRoute = '/(auth)/role-select';
    isInPlace = inAuthGroup;
  } else if (activeRole === 'owner') {
    targetRoute = '/(owner)/(tabs)';
    isInPlace = inOwnerGroup;
  } else if (activeRole === 'walker') {
    targetRoute = '/(walker)/(tabs)/jobs';
    isInPlace = inWalkerGroup;
  } else {
    targetRoute = '/(auth)/role-select';
    isInPlace = inAuthGroup;
  }
  return isInPlace ? null : targetRoute;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  const { session, activeRole, onboardingCompleted, isLoading } = auth;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const topSegment = (segments[0] ?? '') as string;
    const route = resolveRoute(
      session,
      activeRole,
      onboardingCompleted,
      topSegment === '(auth)',
      topSegment === '(onboarding)',
      topSegment === '(owner)',
      topSegment === '(walker)',
    );
    if (route) router.replace(route as Parameters<typeof router.replace>[0]);
  }, [session, segments, isLoading, activeRole, onboardingCompleted, router]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
