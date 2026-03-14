import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(onboarding)' as Parameters<typeof router.replace>[0]);
  }, [router]);

  return null;
}
