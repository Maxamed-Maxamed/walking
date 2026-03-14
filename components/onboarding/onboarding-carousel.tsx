import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
  onSkip: () => void;
}

const { width } = Dimensions.get('window');

export function OnboardingCarousel({
  slides,
  onComplete,
  onSkip,
}: OnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
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

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View className="flex-1 w-full justify-center items-center bg-background px-8 py-16">
      <View className="flex-[0.6] justify-center items-center">{item.icon}</View>
      <View className="flex-[0.4] justify-center w-full">
        <Text className="text-2xl font-bold text-center text-ink mb-3">
          {item.title}
        </Text>
        <Text className="text-base text-center text-muted leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <TouchableOpacity
        onPress={onSkip}
        className="absolute top-12 right-6 z-10 p-2"
        activeOpacity={0.7}
        accessibilityLabel="Skip"
      >
        <Ionicons name="close" size={24} color="#94A3B8" />
      </TouchableOpacity>

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

      <View className="flex-row justify-center items-center py-4 gap-2">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border'
            }`}
          />
        ))}
      </View>

      <View className="px-6 pb-10">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary rounded-xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
