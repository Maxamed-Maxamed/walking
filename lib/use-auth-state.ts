import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import {
  getActiveRoleStorageKey,
  ONBOARDING_COMPLETED_KEY,
  parseUserRole,
  type UserProfile,
  type UserRole,
} from "@/lib/auth-types";

async function fetchProfile(user: User): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, bio, location, onboarding_completed")
    .eq("id", user.id)
    .single();
  if (error) return null;
  return data as UserProfile;
}

export interface UseAuthStateResult {
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  activeRole: UserRole | null;
  onboardingCompleted: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

export function useAuthState(): UseAuthStateResult {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const profileRequestIdRef = useRef(0);

  const isLoading = isAuthLoading || isOnboardingLoading || isRoleLoading;

  function runProfileFetch(user: User) {
    const requestId = ++profileRequestIdRef.current;
    fetchProfile(user)
      .then((p) => {
        if (profileRequestIdRef.current === requestId) setProfile(p);
      })
      .catch(() => {
        if (profileRequestIdRef.current === requestId) setProfile(null);
      });
  }

  const applySession = useCallback(
    (newSession: Session | null, prevUserId?: string | null) => {
      const newUserId = newSession?.user.id ?? null;
      if (newUserId !== prevUserId) {
        setRoles([]);
        setActiveRole(null);
        setProfile(null);
        setIsRoleLoading(Boolean(newUserId));
      }
      setSession(newSession);
      if (newSession?.user) runProfileFetch(newSession.user);
    },
    [],
  );

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
      .then((value) => {
        if (!active) return;
        setOnboardingCompleted(value === "true");
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      applySession(s, currentUserId);
      currentUserId = s?.user.id ?? null;
      setIsAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [applySession]);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) {
      setIsRoleLoading(false);
      return;
    }
    if (activeRole) {
      setIsRoleLoading(false);
      return;
    }
    let active = true;
    setIsRoleLoading(true);
    AsyncStorage.getItem(getActiveRoleStorageKey(userId))
      .then((storedRoleValue) => {
        if (!active) return;
        const storedRole = parseUserRole(storedRoleValue ?? undefined);
        if (storedRole) {
          setActiveRole(storedRole);
          setRoles((prev) =>
            prev.includes(storedRole) ? prev : [...prev, storedRole],
          );
        }
        setIsRoleLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setIsRoleLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session?.user.id, activeRole]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setOnboardingCompleted(true);
  }, []);

  const switchRole = useCallback(
    (role: UserRole) => {
      setActiveRole(role);
      setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
      const userId = session?.user.id;
      if (userId) {
        AsyncStorage.setItem(getActiveRoleStorageKey(userId), role).catch(
          () => {},
        );
      }
    },
    [session?.user.id],
  );

  return {
    session,
    profile,
    roles,
    activeRole,
    onboardingCompleted,
    isLoading,
    completeOnboarding,
    switchRole,
  };
}
