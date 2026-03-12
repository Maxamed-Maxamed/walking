import '@/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AuthProvider } from '@/lib/auth-context';
import { SplashScreenView } from '@/components/splash-screen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});


SplashScreen.setOptions({
  duration: 450,
  fade: true,
});
SplashScreen.preventAutoHideAsync().catch(() => null);

export const unstable_settings = {
  anchor: '(onboarding)',
};

export default function RootLayout() {
  const splashStartedAt = useRef(Date.now());
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [splashTimedOut, setSplashTimedOut] = useState(false);

  useEffect(() => {
    let active = true;

    Asset.loadAsync([
      require('@/assets/images/logo.png'),
      require('@/assets/images/paw-print.png'),
    ])
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

  // Fallback: never stay stuck on splash longer than 5 seconds
  useEffect(() => {
    const id = setTimeout(() => setSplashTimedOut(true), 5000);
    return () => clearTimeout(id);
  }, []);

  const appReady = ((fontsLoaded || !!fontError) && assetsLoaded) || splashTimedOut;

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
    return <SplashScreenView />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(owner)" />
            <Stack.Screen name="(walker)" />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
