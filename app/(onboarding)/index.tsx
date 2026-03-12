import React from 'react';
import { Alert, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { OnboardingCarousel } from './onboarding-carousel';

// Icons from Icons8
const DOG_PAW_ICON = 'https://img.icons8.com/?id=9201&format=png&size=128';
const PERSON_ICON = 'https://img.icons8.com/?id=60391&format=png&size=128';
const WALKING_ICON = 'https://img.icons8.com/?id=2244&format=png&size=128';
const TRUST_ICON = 'https://img.icons8.com/?id=24761&format=png&size=128';
const CHECKMARK_ICON = 'https://img.icons8.com/?id=11695&format=png&size=128';

function IconContainer({
  source,
  backgroundColor,
}: {
  source: string;
  backgroundColor: string;
}) {
  return (
    <View
      className={`w-24 h-24 ${backgroundColor} rounded-full justify-center items-center mb-8`}
    >
      <Image source={{ uri: source }} className="w-16 h-16" resizeMode="contain" />
    </View>
  );
}

const slides = [
  {
    id: '1',
    title: 'Welcome to DogWalker',
    description:
      'Connect dog owners with trusted walkers. Find the perfect walk for your furry friend.',
    icon: <IconContainer source={DOG_PAW_ICON} backgroundColor="bg-indigo-100" />,
  },
  {
    id: '2',
    title: 'For Dog Owners',
    description:
      'Browse verified walkers, book walks with ease, and keep your dogs active and happy.',
    icon: <IconContainer source={PERSON_ICON} backgroundColor="bg-emerald-100" />,
  },
  {
    id: '3',
    title: 'For Dog Walkers',
    description:
      'Earn money doing what you love. Help dogs stay fit and healthy on every walk.',
    icon: <IconContainer source={WALKING_ICON} backgroundColor="bg-blue-100" />,
  },
  {
    id: '4',
    title: 'Safety & Trust',
    description:
      'All walkers are verified. Ratings and reviews ensure the best care for your dog.',
    icon: <IconContainer source={TRUST_ICON} backgroundColor="bg-amber-100" />,
  },
  {
    id: '5',
    title: 'Ready to Get Started?',
    description:
      'Join thousands of happy dog owners and walkers. Tap "Get Started" to begin.',
    icon: <IconContainer source={CHECKMARK_ICON} backgroundColor="bg-indigo-100" />,
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
    <View className="flex-1 bg-white">
      <OnboardingCarousel
        slides={slides}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </View>
  );
}
