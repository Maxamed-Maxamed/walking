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
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
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
    <View className="flex-1 w-full justify-center items-center bg-white px-6 py-12">
      <View className="flex-1 justify-center items-center">{item.icon}</View>
      <View className="flex-1 justify-center w-full">
        <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
          {item.title}
        </Text>
        <Text className="text-lg text-center text-gray-600 leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
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

      {/* Indicators */}
      <View className="flex-row justify-center items-center py-4 gap-2">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-indigo-600'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between items-center px-6 pb-8">
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text className="text-base font-semibold text-gray-600">Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-indigo-600 px-8 py-3 rounded-lg"
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
