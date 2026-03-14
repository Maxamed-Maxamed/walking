export type UserRole = 'owner' | 'walker';

export const ONBOARDING_COMPLETED_KEY = 'dogwalker:onboarding_completed';
export const ACTIVE_ROLE_STORAGE_KEY_PREFIX = 'dogwalker:active_role:';

export function getActiveRoleStorageKey(userId: string): string {
  return `${ACTIVE_ROLE_STORAGE_KEY_PREFIX}${userId}`;
}

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
