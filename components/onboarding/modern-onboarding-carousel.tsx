import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: readonly [string, string, ...string[]];
  iconBg: string;
  accentColor: string;
}

interface ModernOnboardingCarouselProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
  onSkip: () => void;
}

const { width, height } = Dimensions.get('window');

export function ModernOnboardingCarousel({
  slides,
  onComplete,
  onSkip,
}: ModernOnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);

  // Smooth floating animation for icon
  React.useEffect(() => {
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      false
    );
    
    iconTranslateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      false
    );
  }, [currentIndex]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    return (
      <View style={{ width, height }} className="justify-center items-center px-6">
        {/* Animated Gradient Background */}
        <LinearGradient
          colors={[item.gradientColors[0] + '15', item.gradientColors[1] + '10', item.gradientColors[2] + '08']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Decorative Gradient Orbs */}
        <View className="absolute top-20 right-8 w-72 h-72 opacity-30">
          <LinearGradient
            colors={[item.accentColor + '40', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            className="rounded-full"
          />
        </View>

        <View className="absolute bottom-32 left-8 w-56 h-56 opacity-25">
          <LinearGradient
            colors={[item.gradientColors[2] + '35', 'transparent']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
            className="rounded-full"
          />
        </View>

        {/* Content Container */}
        <View className="flex-1 justify-center items-center pt-16">
          {/* Icon Container with Enhanced Animation */}
          <Animated.View style={[iconAnimatedStyle]} className="mb-16">
            <View className="relative items-center justify-center">
              {/* Outer Glow Ring */}
              <View 
                className="absolute w-48 h-48 rounded-full opacity-20"
                style={{ backgroundColor: item.accentColor }}
              />
              
              {/* Middle Glow Ring */}
              <View 
                className="absolute w-40 h-40 rounded-full opacity-30"
                style={{ backgroundColor: item.accentColor }}
              />
              
              {/* Icon Card with Gradient Border */}
              <LinearGradient
                colors={[item.gradientColors[0], item.gradientColors[1], item.gradientColors[2]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-[32px] p-1"
              >
                <View className="bg-white dark:bg-slate-900 rounded-[28px] p-6">
                  <View
                    className="w-28 h-28 rounded-3xl items-center justify-center"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    {item.icon}
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Text Content with Better Spacing */}
          <View className="items-center px-8 max-w-md">
            <Text className="text-[32px] font-extrabold text-center text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
              {item.title}
            </Text>
            <Text className="text-[17px] text-center text-slate-600 dark:text-slate-400 leading-[26px] font-medium">
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      {/* Skip Button with Glassmorphism */}
      <View className="absolute top-14 right-6 z-20">
        <Pressable
          onPress={onSkip}
          className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg active:scale-95"
          style={{ 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-slate-700 dark:text-slate-200 font-semibold text-[15px]">Skip</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Bottom Controls with Enhanced Design */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-12">
        {/* Pagination Dots with Progress Indicator */}
        <View className="flex-row justify-center items-center gap-2 mb-8">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <Pressable
                key={index}
                onPress={() => handleDotPress(index)}
                className="relative"
              >
                {isActive ? (
                  <LinearGradient
                    colors={slide.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-2.5 w-10 rounded-full"
                  />
                ) : (
                  <View className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Action Button with Gradient and Shadow */}
        <Pressable
          onPress={handleNext}
          className="active:scale-[0.98]"
          style={{
            shadowColor: slides[currentIndex].gradientColors[1],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={slides[currentIndex].gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-5 px-6"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white text-[17px] font-bold tracking-wide">
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Ionicons 
                name={currentIndex === slides.length - 1 ? 'arrow-forward' : 'chevron-forward'} 
                size={22} 
                color="white" 
              />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
