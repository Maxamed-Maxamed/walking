import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/auth-context';

export default function RoleSelectScreen() {
  const { session, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const hasContinued = useRef(false);

  // Auto-continue when returning from signup/login with a pre-selected role
  useEffect(() => {
    if (!isLoading && session && params.role && !hasContinued.current) {
      if (params.role === 'owner' || params.role === 'walker') {
        hasContinued.current = true;
        const role: UserRole = params.role;
        setSelectedRole(role);
        switchRole(role);
      }
    }
  }, [isLoading, session, params.role, switchRole]);

  function handleCreateAccount() {
    if (!selectedRole) return;
    router.push({ pathname: '/(auth)/signup', params: { role: selectedRole } });
  }

  function handleSignIn() {
    if (!selectedRole) return;
    router.push({ pathname: '/(auth)/login', params: { role: selectedRole } });
  }

  function handleContinue() {
    if (selectedRole) switchRole(selectedRole);
  }

  return (
    <SafeAreaView className="flex-1 bg-warm" edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center px-6 py-8">
        
        {/* Logo & Title */}
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
        <Text className="mt-4 font-serif text-3xl font-semibold text-amber-900">
          DogWalker
        </Text>
        
        {/* Heading */}
        <Text className="mt-10 text-center text-2xl font-bold text-amber-900">
          Who are you?
        </Text>
        <Text className="mt-2 text-center text-base text-amber-800">
          Choose how you'll use DogWalker
        </Text>

        {/* Role Cards */}
        <View className="mt-8 w-full gap-4">
          <RoleCard
            emoji="🐾"
            title="Dog Owner"
            description="Find trusted walkers for your furry friend"
            isSelected={selectedRole === 'owner'}
            onPress={() => { setSelectedRole('owner'); }}
          />
          <RoleCard
            emoji="🦮"
            title="Dog Walker"
            description="Earn money walking dogs in your neighborhood"
            isSelected={selectedRole === 'walker'}
            onPress={() => { setSelectedRole('walker'); }}
          />
        </View>

        {/* CTA buttons — vary based on auth state */}
        {session ? (
          // Authenticated: just continue with selected role
          <Pressable
            onPress={handleContinue}
            disabled={!selectedRole}
            accessibilityRole="button"
            accessibilityState={{ disabled: !selectedRole }}
            className={`mt-10 w-full rounded-2xl py-4 ${
              selectedRole ? 'bg-amber-500' : 'bg-gray-300'
            }`}>
            <Text className={`text-center text-lg font-bold ${
              selectedRole ? 'text-white' : 'text-gray-500'
            }`}>
              Continue
            </Text>
          </Pressable>
        ) : (
          // Unauthenticated: show signup + login options
          <View className={`mt-10 w-full gap-3 transition-opacity ${selectedRole ? 'opacity-100' : 'opacity-40'}`}>
            <Pressable
              onPress={handleCreateAccount}
              disabled={!selectedRole}
              accessibilityRole="button"
              accessibilityState={{ disabled: !selectedRole }}
              className="w-full rounded-2xl bg-amber-500 py-4">
              <Text className="text-center text-lg font-bold text-white">
                Create Account
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSignIn}
              disabled={!selectedRole}
              accessibilityRole="button"
              accessibilityState={{ disabled: !selectedRole }}
              className="w-full rounded-2xl border-2 border-amber-500 py-4">
              <Text className="text-center text-lg font-bold text-amber-600">
                Sign In
              </Text>
            </Pressable>
          </View>
        )}
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

  const handlePressIn = () => { scale.value = withSpring(0.97); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${title}: ${description}`}
        className={`w-full rounded-2xl border-2 bg-white p-6 ${
          isSelected ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
        }`}>
        <Text className="text-5xl">{emoji}</Text>
        <Text className="mt-3 text-2xl font-bold text-amber-900">{title}</Text>
        <Text className="mt-2 text-base leading-6 text-amber-800">{description}</Text>
      </Pressable>
    </Animated.View>
  );
}
