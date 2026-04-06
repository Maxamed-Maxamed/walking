import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "./ui/logo";

export function CustomSplashScreen() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
      <View className="flex-1 items-center justify-center w-full">
        <View className="items-center">
          <Logo size={140} className="rounded-3xl" />
          <Text className="text-3xl font-bold text-gray-900 mt-8 tracking-wide">
            DogWalker
          </Text>
        </View>

        <View className="absolute bottom-24 items-center justify-center">
          <Animated.View style={animatedStyle} className="w-12 h-12">
            {/* Simple dot spinner imitating the design */}
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                className="absolute w-full h-full"
                style={{ transform: [{ rotate: `${i * 45}deg` }] }}
              >
                <View
                  className={`w-3 h-3 rounded-full bg-black mx-auto`}
                  style={{ opacity: 1 - i * 0.1 }}
                />
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
