import { AccessibilityInfo } from "react-native";
import { useEffect, useState } from "react";

/**
 * Mirrors system "Reduce motion" (iOS) / transition animation scale (Android).
 * @see https://reactnative.dev/docs/accessibilityinfo#isreducemotionenabled
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (!cancelled) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (v) => {
        setReduceMotion(v);
      },
    );
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
