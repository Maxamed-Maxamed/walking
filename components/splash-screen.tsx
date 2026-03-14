import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function SplashScreenView() {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 400 });
    titleOpacity.value = withTiming(1, { duration: 400 });
  }, [logoOpacity, logoScale, titleOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-warm">
      <Animated.View
        className="w-28 h-28 rounded-full bg-primary items-center justify-center mb-6 shadow-lg"
        style={logoStyle}
      >
        <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={titleStyle}>
        <Text className="text-4xl font-bold text-primary tracking-tight font-display">
          DogWalker
        </Text>
      </Animated.View>
    </View>
  );
}
