import '@/global.css';

import { SplashScreenView } from '@/components/splash-screen';
import { AuthProvider } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

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

const MINIMUM_SPLASH_MS = 5000;

export default function RootLayout() {
  // const splashStartedAt = useRef(Date.now());
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [splashTimedOut, setSplashTimedOut] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  

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

  // Ensure branded splash is visible for at least MINIMUM_SPLASH_MS
  useEffect(() => {
    const id = setTimeout(() => {
      setMinimumElapsed(true);
    }, MINIMUM_SPLASH_MS);
    return () => clearTimeout(id);
  }, []);

  // Fallback: never stay stuck on splash longer than 7 seconds
  useEffect(() => {
    const id = setTimeout(() => {
      setSplashTimedOut(true);
    }, 7000);
    return () => clearTimeout(id);
  }, []);

  const resourcesReady = ((fontsLoaded || !!fontError) && assetsLoaded) || splashTimedOut;
  const showSplash = !(resourcesReady && minimumElapsed);

  useEffect(() => {
    if (!showSplash) {
      SplashScreen.hideAsync().catch(() => null);
    }
  }, [showSplash]);

  if (showSplash) {
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
