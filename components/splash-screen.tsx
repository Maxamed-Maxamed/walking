import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function LoadingDot({ color, delay }: { color: string; delay: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.6, { duration: 380, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 380, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: color,
  }));

  return <Animated.View className="w-3 h-3 rounded-full mx-1.5" style={animStyle} />;
}

export function SplashScreenView() {
  // Logo circle scale-in
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  // Title slide-up + fade
  const titleTranslateY = useSharedValue(24);
  const titleOpacity = useSharedValue(0);

  // Tagline slide-up + fade
  const taglineTranslateY = useSharedValue(16);
  const taglineOpacity = useSharedValue(0);

  // Dots container fade in
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo springs in immediately
    logoScale.value = withSpring(1, { damping: 10, stiffness: 120 });
    logoOpacity.value = withTiming(1, { duration: 400 });

    // Title after 300ms
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(
      300,
      withSpring(0, { damping: 14, stiffness: 100 }),
    );

    // Tagline after 550ms
    taglineOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    taglineTranslateY.value = withDelay(
      550,
      withSpring(0, { damping: 14, stiffness: 100 }),
    );

    // Dots after 900ms
    dotsOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
  }, [dotsOpacity, logoOpacity, logoScale, taglineOpacity, taglineTranslateY, titleOpacity, titleTranslateY]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: taglineTranslateY.value }],
    opacity: taglineOpacity.value,
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-warm">
      {/* Logo circle */}
      <Animated.View
        className="w-28 h-28 rounded-full bg-primary items-center justify-center mb-8 shadow-lg"
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

      {/* App name */}
      <Animated.View style={titleStyle}>
        <Text
          className="text-5xl font-bold text-primary tracking-tight mb-2"
          style={{ fontFamily: 'Avenir Next' }}
        >
          DogWalker
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={taglineStyle}>
        <View className="flex-row items-center mb-14">
          <Text className="text-lg text-secondary font-medium tracking-wide">
            Walks made simple{'  '}
          </Text>
          <Image
            source={require('@/assets/images/paw-print.png')}
            style={{ width: 22, height: 22 }}
            contentFit="contain"
          />
        </View>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View className="flex-row items-center" style={dotsStyle}>
        <LoadingDot color="#E76F51" delay={0} />
        <LoadingDot color="#2A9D8F" delay={160} />
        <LoadingDot color="#E76F51" delay={320} />
      </Animated.View>
    </View>
  );
}
