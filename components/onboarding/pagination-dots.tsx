import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

const DOT_SIZE = 8;
const ACTIVE_WIDTH = 24;
const DOT_GAP = 8;
const ACTIVE_COLOR = "#1A1A2E";
const INACTIVE_COLOR = "#E5E7EB";

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
      opacity: withTiming(isActive ? 1 : 0.6, {
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
    <View className="flex-row items-center justify-center py-6">
      {Array.from({ length: total }).map((_, index) => (
        <Dot key={index} isActive={index === currentIndex} />
      ))}
    </View>
  );
}
