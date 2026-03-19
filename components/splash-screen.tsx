import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

// Prevent auto-hiding of native splash screen
SplashScreen.preventAutoHideAsync();

export function SplashScreenView() {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  const hideSplashScreen = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (e) {
      console.warn('Error hiding splash screen:', e);
    }
  }, []);

  useEffect(() => {
    // Logo: spring pop-in effect (lively bounce)
    logoScale.value = withSpring(1.2, { damping: 15, stiffness: 150 });
    logoScale.value = withDelay(300, withSpring(1, { damping: 20, stiffness: 150 }));
    
    // Logo: fade in
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    
    // Title: fade in and move up
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(600, withTiming(0, { duration: 500 }));
    
    // Hide splash screen after animations complete
    const hideDelay = 2000; // 2 seconds total animation time
    const hideTimer = setTimeout(hideSplashScreen, hideDelay);
    
    return () => clearTimeout(hideTimer);
  }, [logoScale, logoOpacity, titleOpacity, titleTranslateY, hideSplashScreen]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-warm">
      <Animated.View
        className="w-28 h-28 rounded-full bg-primary/10 items-center justify-center mb-6"
        style={logoStyle}
      >
        <View className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm items-center justify-center">
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 48, height: 48 }}
            contentFit="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={titleStyle}>
        <Text className="text-3xl font-bold text-primary/80 tracking-wider font-display">
          DogWalker
        </Text>
      </Animated.View>
    </View>
  );
}