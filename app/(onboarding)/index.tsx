import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
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
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationDots } from "@/components/onboarding/pagination-dots";
import { Logo } from "@/components/ui/logo";
import { setOnboardingCompleted } from "@/lib/onboarding-storage";

/* ─── slide content data ─── */
interface OnboardingSlide {
  title: string;
  body: string;
  buttonLabel: string;
  ionicon: keyof typeof Ionicons.glyphMap;
  iconSource: ImageSourcePropType;
}

type SlideIndex = 0 | 1 | 2 | 3;

const FIRST_SLIDE_INDEX: SlideIndex = 0;
const LAST_SLIDE_INDEX: SlideIndex = 3;

const SLIDES = [
  {
    title: "Find Your Perfect Match",
    body: "Browse hundreds of verified, background-checked walkers in your neighborhood",
    buttonLabel: "Next",
    ionicon: "map-outline",
    iconSource: require("@/assets/icons/onboarding-map.png"),
  },
  {
    title: "Safe & Secure Payments",
    body: "Cashless payments and premium insurance for every walk. Your pet is in safe hands",
    buttonLabel: "Next",
    ionicon: "shield-checkmark-outline",
    iconSource: require("@/assets/icons/onboarding-shield.png"),
  },
  {
    title: "Verified & Trusted Walkers",
    body: "Every walker on our platform undergoes a multi-step background check and safety training",
    buttonLabel: "Next",
    ionicon: "checkmark-done-circle-outline",
    iconSource: require("@/assets/icons/onboarding-verified.png"),
  },
  {
    title: "Join the Pack",
    body: "Read reviews from other pet parents and see photos of happy dogs in your area",
    buttonLabel: "Get Started",
    ionicon: "people-outline",
    iconSource: require("@/assets/icons/onboarding-community.png"),
  },
] satisfies ReadonlyArray<OnboardingSlide>;

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

/* ─── animated logo tile with teal glow ─── */
function LogoTile() {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [pulseScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          shadowColor: "#2DD4A8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 8,
        },
      ]}
      className="rounded-3xl bg-white p-1"
    >
      <Logo size={80} className="rounded-2xl" />
    </Animated.View>
  );
}

/* ─── animated CTA button ─── */
function CTAButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
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
        className="flex-row items-center justify-center rounded-2xl bg-onboarding-headline py-4 px-8"
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text className="text-base font-semibold text-white mr-2">
          {label}
        </Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

/* ─── slide content with entrance animations ─── */
function SlideContent({
  slide,
}: {
  slide: OnboardingSlide;
}) {
  const { width } = useWindowDimensions();
  const iconSize = Math.min(width * 0.35, 160);

  return (
    <Animated.View
      key={slide.title}
      entering={SlideInRight.duration(350).easing(
        Easing.bezier(0.4, 0, 0.2, 1),
      )}
      exiting={SlideOutLeft.duration(300).easing(
        Easing.bezier(0.4, 0, 0.2, 1),
      )}
      className="flex-1 items-center px-6"
    >
      {/* headline */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(400)}
        className="w-full mb-6"
      >
        <Text className="text-3xl font-bold text-onboarding-headline text-left tracking-tight">
          {slide.title}
        </Text>
      </Animated.View>

      {/* logo tile */}
      <Animated.View
        entering={FadeIn.delay(150).duration(400)}
        className="mb-8"
      >
        <LogoTile />
      </Animated.View>

      {/* body text */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        className="mb-8 px-4"
      >
        <Text className="text-base text-onboarding-body text-center leading-6">
          {slide.body}
        </Text>
      </Animated.View>

      {/* themed icon */}
      <Animated.View
        entering={ZoomIn.delay(300).duration(500).springify()}
        style={{
          shadowColor: "#2DD4A8",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 6,
        }}
        className="rounded-full bg-white p-5"
      >
        <Image
          source={slide.iconSource}
          style={{ width: iconSize, height: iconSize }}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

/* ─── main onboarding screen ─── */
export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState<SlideIndex>(
    FIRST_SLIDE_INDEX,
  );
  const router = useRouter();

  const currentSlide = getSlide(currentIndex);
  const isLastSlide = currentIndex === LAST_SLIDE_INDEX;

  const handleSkip = useCallback(async () => {
    await setOnboardingCompleted();
    router.replace("/" as Href);
  }, [router]);

  const handleNext = useCallback(async () => {
    if (isLastSlide) {
      await setOnboardingCompleted();
      router.replace("/" as Href);
    } else {
      setCurrentIndex((prev) => getNextSlideIndex(prev));
    }
  }, [isLastSlide, router]);

  const handleSkipPress = useCallback(() => {
    void handleSkip();
  }, [handleSkip]);

  const handleNextPress = useCallback(() => {
    void handleNext();
  }, [handleNext]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* skip button */}
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable
          onPress={handleSkipPress}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text className="text-base font-medium text-onboarding-body">
            Skip
          </Text>
        </Pressable>
      </View>

      {/* slide content — keyed for remount animation */}
      <View className="flex-1 justify-center pt-4">
        <SlideContent
          key={currentIndex}
          slide={currentSlide}
        />
      </View>

      {/* pagination dots */}
      <PaginationDots total={SLIDES.length} currentIndex={currentIndex} />

      {/* CTA button */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(500)}
        className="px-6 pb-8"
      >
        <CTAButton
          label={currentSlide.buttonLabel}
          onPress={handleNextPress}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
