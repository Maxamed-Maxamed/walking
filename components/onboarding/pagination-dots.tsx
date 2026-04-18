import React from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

const DOT_SIZE = 8;
const ACTIVE_WIDTH = 28;
const DOT_GAP = 8;
/** Matches tailwind `onboarding.headline` */
const ACTIVE_COLOR = "#111827";
/** Matches tailwind `onboarding.dot` */
const INACTIVE_COLOR = "#e5e7eb";

function Dot({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? ACTIVE_WIDTH : DOT_SIZE, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      backgroundColor: withTiming(isActive ? ACTIVE_COLOR : INACTIVE_COLOR, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      opacity: withTiming(isActive ? 1 : 0.55, {
        duration: 300,
      }),
    };
  }, [isActive]);

  return (
    <Animated.View
      style={[
        {
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          marginHorizontal: DOT_GAP / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export function PaginationDots({ total, currentIndex }: PaginationDotsProps) {
  return (
    <View
      className="flex-row items-center justify-center py-5"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: total }).map((_, index) => (
        <Dot key={index} isActive={index === currentIndex} />
      ))}
    </View>
  );
}
