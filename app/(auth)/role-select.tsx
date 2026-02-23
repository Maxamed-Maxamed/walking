import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type Role = 'owner' | 'walker' | null;

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (selectedRole === 'owner') {
      router.push('/(owner)/(tabs)/');
    } else if (selectedRole === 'walker') {
      router.push('/(walker)/(tabs)/jobs');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F0]" edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center px-6 py-8">
        
        {/* Logo & Title */}
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
        <Text className="mt-4 font-serif text-3xl font-semibold text-[#78350F]">
          DogWalker
        </Text>
        
        {/* Heading */}
        <Text className="mt-10 text-center text-2xl font-bold text-[#78350F]">
          Choose Your Role
        </Text>

        {/* Role Cards */}
        <View className="mt-8 w-full gap-4">
          <RoleCard
            emoji="🐾"
            title="Dog Owner"
            description="Find trusted walkers for your furry friend"
            isSelected={selectedRole === 'owner'}
            onPress={() => setSelectedRole('owner')}
          />

          <RoleCard
            emoji="🦮"
            title="Dog Walker"
            description="Earn money walking dogs in your neighborhood"
            isSelected={selectedRole === 'walker'}
            onPress={() => setSelectedRole('walker')}
          />
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole}
          className={`mt-10 w-full rounded-2xl py-4 ${
            selectedRole ? 'bg-amber-500' : 'bg-gray-300'
          }`}>
          <Text className={`text-center text-lg font-bold ${
            selectedRole ? 'text-white' : 'text-gray-500'
          }`}>
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function RoleCard({
  emoji,
  title,
  description,
  isSelected,
  onPress,
}: {
  emoji: string;
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`w-full rounded-2xl border-2 bg-white p-6 ${
          isSelected ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
        }`}>
        <Text className="text-5xl">{emoji}</Text>
        <Text className="mt-3 text-2xl font-bold text-[#78350F]">{title}</Text>
        <Text className="mt-2 text-base leading-6 text-[#92400E]">{description}</Text>
      </Pressable>
    </Animated.View>
  );
}
