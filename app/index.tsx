import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, type Router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const ONBOARDING_COMPLETED_KEY = "@onboarding_completed";

function navigateToOnboarding(router: Router) {
  router.replace("/(onboarding)/welcome" as any);
}

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkOnboardingStatus = async () => {
      try {
        // Small delay to ensure AsyncStorage writes are complete
        await new Promise((resolve) => setTimeout(resolve, 100));
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        console.log("Onboarding completed:", completed);

        if (!completed) {
          console.log("Redirecting to onboarding");
          navigateToOnboarding(router);
        } else {
          console.log("Onboarding done, showing welcome");
          if (isMounted) {
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        navigateToOnboarding(router);
      }
    };

    void checkOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isChecking) {
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
