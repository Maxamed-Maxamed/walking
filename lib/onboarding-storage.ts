import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { ONBOARDING_COMPLETED_STORAGE_ID } from "@/lib/auth-types";

const ONBOARDING_COMPLETED_VALUE = "true";
const ONBOARDING_SECURE_STORE_KEY =
  ONBOARDING_COMPLETED_STORAGE_ID.replaceAll(":", ".");

function getWebStorageValue(): string | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_ID);
}

function setWebStorageValue(value: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_ID, value);
}

function removeWebStorageValue(): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(ONBOARDING_COMPLETED_STORAGE_ID);
}

/**
 * Check if the user has completed (or skipped) onboarding.
 */
export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      return getWebStorageValue() === ONBOARDING_COMPLETED_VALUE;
    }

    const value = await SecureStore.getItemAsync(ONBOARDING_SECURE_STORE_KEY);
    return value === ONBOARDING_COMPLETED_VALUE;
  } catch {
    return false;
  }
}

/**
 * Mark onboarding as completed in device storage.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      setWebStorageValue(ONBOARDING_COMPLETED_VALUE);
      return;
    }

    await SecureStore.setItemAsync(
      ONBOARDING_SECURE_STORE_KEY,
      ONBOARDING_COMPLETED_VALUE,
    );
  } catch {
    // Silently fail — non-critical
  }
}

/**
 * Reset onboarding state (useful for dev/testing).
 */
export async function resetOnboarding(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      removeWebStorageValue();
      return;
    }

    await SecureStore.deleteItemAsync(ONBOARDING_SECURE_STORE_KEY);
  } catch {
    // Silently fail
  }
}
