import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const ONBOARDING_COMPLETED_KEY = "@onboarding_completed";

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);

        if (!completed) {
          router.replace("/(onboarding)" as const);
        } else {
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        router.replace("/(onboarding)" as const);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
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
