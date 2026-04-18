import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  type ImageSourcePropType,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationDots } from "@/components/onboarding/pagination-dots";
import { Logo } from "@/components/ui/logo";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

interface OnboardingSlide {
  title: string;
  body: string;
  buttonLabel: string;
  iconSource: ImageSourcePropType;
}

type SlideIndex = 0 | 1 | 2 | 3;

const FIRST_SLIDE_INDEX: SlideIndex = 0;
const LAST_SLIDE_INDEX: SlideIndex = 3;

const ONBOARDING_COMPLETED_KEY = "@onboarding_completed";

const SLIDES = [
  {
    title: "Find your perfect match",
    body: "Browse verified walkers near you and book walks that fit your schedule.",
    buttonLabel: "Next",
    iconSource: require("@/assets/icons/onboarding-map.png"),
  },
  {
    title: "Safe, cashless payments",
    body: "Pay in the app with clear pricing—no awkward handoffs at the door.",
    buttonLabel: "Next",
    iconSource: require("@/assets/icons/onboarding-shield.png"),
  },
  {
    title: "Walkers you can trust",
    body: "Profiles, reviews, and safety checks help you choose with confidence.",
    buttonLabel: "Next",
    iconSource: require("@/assets/icons/onboarding-verified.png"),
  },
  {
    title: "Join the pack",
    body: "See photos and updates from walks so you always know how your dog is doing.",
    buttonLabel: "Get started",
    iconSource: require("@/assets/icons/onboarding-community.png"),
  },
] satisfies readonly OnboardingSlide[];

function getSlide(index: SlideIndex): OnboardingSlide {
  switch (index) {
    case 0:
      return SLIDES[0];
    case 1:
      return SLIDES[1];
    case 2:
      return SLIDES[2];
    case 3:
      return SLIDES[3];
  }
}

function getNextSlideIndex(index: SlideIndex): SlideIndex {
  switch (index) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 3;
  }
}

function CTAButton({
  label,
  onPress,
  isLastSlide,
}: {
  label: string;
  onPress: () => void;
  isLastSlide: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="w-full">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="min-h-[52px] flex-row items-center justify-center rounded-2xl bg-onboarding-headline px-8 py-4"
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={
          isLastSlide
            ? "Completes onboarding and continues to the app"
            : "Goes to the next onboarding screen"
        }
      >
        <Text className="mr-2 text-base font-semibold text-white">{label}</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

function SlideContent({
  slide,
  slideIndex,
  total,
  reduceMotion,
}: {
  slide: OnboardingSlide;
  slideIndex: number;
  total: number;
  reduceMotion: boolean;
}) {
  const { width } = useWindowDimensions();
  const iconSize = Math.min(width * 0.42, 200);

  const a11yLabel = `Step ${slideIndex + 1} of ${total}. ${slide.title}. ${slide.body}`;

  const enter = reduceMotion
    ? undefined
    : SlideInRight.duration(320).easing(Easing.bezier(0.4, 0, 0.2, 1));
  const exit = reduceMotion
    ? undefined
    : SlideOutLeft.duration(260).easing(Easing.bezier(0.4, 0, 0.2, 1));

  return (
    <Animated.View
      key={slide.title}
      entering={enter}
      exiting={exit}
      className="flex-1 px-6"
    >
      <View
        accessible
        accessibilityLabel={a11yLabel}
        className="flex-1 justify-center"
      >
        <View className="mb-8 overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-sm">
          <View className="mb-6 items-center">
            <View
              className="rounded-2xl p-4"
              style={{
                shadowColor: "#2DD4A8",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 6,
              }}
            >
              <Image
                source={slide.iconSource}
                style={{ width: iconSize, height: iconSize }}
                contentFit="contain"
                accessible={false}
              />
            </View>
          </View>
          {reduceMotion ? (
            <>
              <Text className="mb-3 font-display text-3xl font-bold leading-tight tracking-tight text-onboarding-headline">
                {slide.title}
              </Text>
              <Text className="text-base leading-6 text-onboarding-body">
                {slide.body}
              </Text>
            </>
          ) : (
            <>
              <Animated.View entering={FadeInUp.delay(80).duration(320)}>
                <Text className="mb-3 font-display text-3xl font-bold leading-tight tracking-tight text-onboarding-headline">
                  {slide.title}
                </Text>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(140).duration(340)}>
                <Text className="text-base leading-6 text-onboarding-body">
                  {slide.body}
                </Text>
              </Animated.View>
            </>
          )}
        </View>

        <Text
          className="text-center text-sm font-medium text-muted"
          accessibilityElementsHidden
        >
          {slideIndex + 1} / {total}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] =
    useState<SlideIndex>(FIRST_SLIDE_INDEX);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const checkAlreadyCompleted = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        if (completed) {
          router.replace("/" as Href);
        } else {
          setIsChecking(false);
        }
      } catch {
        setIsChecking(false);
      }
    };
    void checkAlreadyCompleted();
  }, [router]);

  const currentSlide = getSlide(currentIndex);
  const isLastSlide = currentIndex === LAST_SLIDE_INDEX;

  const finishOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    router.replace("/" as Href);
  }, [router]);

  const handleSkip = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await finishOnboarding();
    } catch {
      setIsProcessing(false);
    }
  }, [finishOnboarding, isProcessing]);

  const handleNext = useCallback(async () => {
    if (isProcessing) return;

    if (isLastSlide) {
      setIsProcessing(true);
      try {
        await finishOnboarding();
      } catch {
        setIsProcessing(false);
      }
    } else {
      setCurrentIndex(getNextSlideIndex(currentIndex));
    }
  }, [currentIndex, finishOnboarding, isLastSlide, isProcessing]);

  const handleSkipPress = useCallback(() => {
    void handleSkip();
  }, [handleSkip]);

  const handleNextPress = useCallback(() => {
    void handleNext();
  }, [handleNext]);

  if (isChecking) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#111827" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pb-2 pt-1">
        <Logo size={44} className="rounded-xl" />
        <Pressable
          onPress={handleSkipPress}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text className="text-base font-semibold text-onboarding-body">
            Skip
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SlideContent
          key={currentIndex}
          slide={currentSlide}
          slideIndex={currentIndex}
          total={SLIDES.length}
          reduceMotion={reduceMotion}
        />
      </ScrollView>

      <View className="border-t border-border bg-background px-6 pb-6 pt-2">
        <PaginationDots total={SLIDES.length} currentIndex={currentIndex} />
        {!reduceMotion ? (
          <Animated.View entering={FadeIn.duration(280)}>
            <CTAButton
              label={currentSlide.buttonLabel}
              onPress={handleNextPress}
              isLastSlide={isLastSlide}
            />
          </Animated.View>
        ) : (
          <CTAButton
            label={currentSlide.buttonLabel}
            onPress={handleNextPress}
            isLastSlide={isLastSlide}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
