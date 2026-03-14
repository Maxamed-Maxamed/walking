import React from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { OnboardingCarousel } from '@/components/onboarding/onboarding-carousel';

function IconContainer({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="w-24 h-24 rounded-full bg-primary-light justify-center items-center mb-8">
      <Ionicons name={name} size={48} color="#4F46E5" />
    </View>
  );
}

const slides = [
  {
    id: '1',
    title: 'Welcome to DogWalker',
    description: 'Connect dog owners with trusted walkers in your area.',
    icon: <IconContainer name="paw" />,
  },
  {
    id: '2',
    title: 'For Dog Owners',
    description: 'Browse walkers, book walks, and keep your dogs happy.',
    icon: <IconContainer name="person" />,
  },
  {
    id: '3',
    title: 'For Dog Walkers',
    description: 'Earn money doing what you love. Get started today.',
    icon: <IconContainer name="walk" />,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { session, completeOnboarding } = useAuth();

  const markOnboardingComplete = async () => {
    try {
      await completeOnboarding();

      if (session?.user.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', session.user.id);

        if (error) {
          Alert.alert(
            'Onboarding saved on device',
            `Profile sync failed: ${error.message}. You can continue.`,
          );
        }
      }

      router.replace('/(auth)/role-select');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Unable to complete onboarding', message);
    }
  };

  const handleComplete = () => {
    markOnboardingComplete();
  };

  const handleSkip = () => {
    markOnboardingComplete();
  };

  return (
    <View className="flex-1 bg-background">
      <OnboardingCarousel
        slides={slides}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </View>
  );
}
