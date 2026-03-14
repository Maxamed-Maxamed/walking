import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useAuth, parseUserRole } from '@/lib/auth-context';
import type { UserRole } from '@/lib/auth-context';

export default function RoleSelectScreen() {
  const { session, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const hasContinued = useRef(false);

  useEffect(() => {
    if (!session) {
      hasContinued.current = false;
    }
  }, [session]);

  useEffect(() => {
    if (!isLoading && session && params.role && !hasContinued.current) {
      const role = parseUserRole(params.role);
      if (role) {
        hasContinued.current = true;
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
        <Logo size={80} />
        <Text className="mt-3 text-2xl font-bold text-ink font-display">
          DogWalker
        </Text>

        <Text className="mt-10 text-center text-xl font-bold text-ink">
          Who are you?
        </Text>

        <View className="mt-6 w-full gap-3">
          <RoleCard
            icon="paw"
            title="Dog Owner"
            description="Find trusted walkers for your furry friend"
            isSelected={selectedRole === 'owner'}
            onPress={() => setSelectedRole('owner')}
          />
          <RoleCard
            icon="walk"
            title="Dog Walker"
            description="Earn money walking dogs in your neighborhood"
            isSelected={selectedRole === 'walker'}
            onPress={() => setSelectedRole('walker')}
          />
        </View>

        {session ? (
          <Button
            onPress={handleContinue}
            disabled={!selectedRole}
            className="mt-8 w-full"
          >
            Continue
          </Button>
        ) : (
          <View
            className={`mt-8 w-full gap-3 ${selectedRole ? 'opacity-100' : 'opacity-40'}`}>
            <Button onPress={handleCreateAccount} disabled={!selectedRole} className="w-full">
              Create Account
            </Button>
            <Button
              variant="outline"
              onPress={handleSignIn}
              disabled={!selectedRole}
              className="w-full"
            >
              Sign In
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RoleCard({
  icon,
  title,
  description,
  isSelected,
  onPress,
}: {
  icon: 'paw' | 'walk';
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
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${title}: ${description}`}
        className={`w-full rounded-2xl border-2 p-5 ${
          isSelected ? 'border-primary bg-primary-light' : 'border-border bg-surface'
        }`}>
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 rounded-full bg-primary-light items-center justify-center">
            <Ionicons
              name={icon}
              size={24}
              color="#4F46E5"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-ink">{title}</Text>
            <Text className="mt-0.5 text-sm text-muted">{description}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
