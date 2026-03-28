import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getOnboardingCompleted } from "@/lib/onboarding-storage";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    getOnboardingCompleted().then((completed) => {
      if (!active) return;

      if (!completed) {
        router.replace("/(onboarding)" as Href);
      } else {
        setChecking(false);
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1A1A2E" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-ink">Welcome to DogWalker!</Text>
    </View>
  );
}
