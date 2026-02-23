import '../global.css';

import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { DogWalkerSplash } from '@/components/ui/dogwalker-splash';

SplashScreen.setOptions({
  duration: 450,
  fade: true,
});
void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const splashStartedAt = useRef(Date.now());
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    Asset.loadAsync([require('@/assets/images/logo.png')])
      .catch(() => null)
      .finally(() => {
        if (active) {
          setAssetsLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const appReady = fontsLoaded && assetsLoaded;

  useEffect(() => {
    if (!appReady) return;

    const minimumSplashMs = 900;
    const elapsed = Date.now() - splashStartedAt.current;
    const remaining = Math.max(0, minimumSplashMs - elapsed);

    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => null);
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [appReady]);

  if (!appReady) {
    // Native platforms keep the configured native splash visible.
    // Web has no native splash, so render the branded fallback.
    if (Platform.OS === 'web') {
      return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar style="dark" />
          <DogWalkerSplash />
        </SafeAreaProvider>
      );
    }

    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(owner)" />
        <Stack.Screen name="(walker)" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
