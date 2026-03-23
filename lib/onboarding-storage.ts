import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@dogwalker/onboarding_completed";

/**
 * Check if the user has completed (or skipped) onboarding.
 */
export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch {
    return false;
  }
}

/**
 * Mark onboarding as completed in local storage.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // Silently fail — non-critical
  }
}

/**
 * Reset onboarding state (useful for dev/testing).
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // Silently fail
  }
}
