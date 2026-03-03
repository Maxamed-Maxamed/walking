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
void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const splashStartedAt = useRef(Date.now());
  const [fontsLoaded, fontError] = useFonts({
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

  const appReady = (fontsLoaded || !!fontError) && assetsLoaded;

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
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
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
