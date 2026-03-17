import { ModernOnboardingCarousel } from '@/components/onboarding/modern-onboarding-carousel';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, View } from 'react-native';

const slides = [
  {
    id: '1',
    title: 'Welcome to DogWalker',
    description: 'Connect with trusted, verified dog walkers in your neighborhood who love pets as much as you do.',
    icon: <Image source={{ uri: 'https://img.icons8.com/?id=2743&format=png&size=96' }} style={{ width: 72, height: 72 }} resizeMode="contain" />,
    gradientColors: ['#6366F1', '#8B5CF6', '#EC4899'] as const,
    iconBg: '#6366F1',
    accentColor: '#8B5CF6',
  },
  {
    id: '2',
    title: 'Track Every Walk',
    description: 'Real-time GPS tracking lets you follow your dog\'s adventure. Get photos and updates during each walk.',
    icon: <Image source={{ uri: 'https://img.icons8.com/?id=7qJ-AxBO6Mkj&format=png&size=96' }} style={{ width: 72, height: 72 }} resizeMode="contain" />,
    gradientColors: ['#10B981', '#14B8A6', '#06B6D4'] as const,
    iconBg: '#10B981',
    accentColor: '#14B8A6',
  },
  {
    id: '3',
    title: 'Easy Scheduling',
    description: 'Book walks in seconds. Set recurring schedules or request on-demand walks whenever you need them.',
    icon: <Image source={{ uri: 'https://img.icons8.com/?id=19612&format=png&size=96' }} style={{ width: 72, height: 72 }} resizeMode="contain" />,
    gradientColors: ['#F59E0B', '#EF4444', '#EC4899'] as const,
    iconBg: '#F59E0B',
    accentColor: '#EF4444',
  },
  {
    id: '4',
    title: 'Stay Connected',
    description: 'Get instant notifications about your dog\'s walks, health updates, and important reminders.',
    icon: <Image source={{ uri: 'https://img.icons8.com/?id=25046&format=png&size=96' }} style={{ width: 72, height: 72 }} resizeMode="contain" />,
    gradientColors: ['#8B5CF6', '#A855F7', '#D946EF'] as const,
    iconBg: '#8B5CF6',
    accentColor: '#A855F7',
  },
  {
    id: '5',
    title: 'Peace of Mind',
    description: 'All walkers are insured and background-checked. Your furry friend is in safe, caring hands.',
    icon: <Image source={{ uri: 'https://img.icons8.com/?id=YqMviGkCsvoB&format=png&size=96' }} style={{ width: 72, height: 72 }} resizeMode="contain" />,
    gradientColors: ['#3B82F6', '#6366F1', '#06B6D4'] as const,
    iconBg: '#3B82F6',
    accentColor: '#6366F1',
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
    <View className="flex-1">
      <ModernOnboardingCarousel
        slides={slides}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </View>
  );
}
