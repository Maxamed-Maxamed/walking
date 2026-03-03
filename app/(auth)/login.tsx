import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params.role ?? 'owner') as UserRole;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const loginEmail = email.trim();
    const loginPassword = password.trim();

    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      // Go back to role-select with the role pre-selected — auto-continue will fire
      router.replace({ pathname: '/(auth)/role-select', params: { role } });
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 96, height: 96 }}
        contentFit="contain"
      />
      <Text className="text-2xl font-bold text-gray-900">DogWalker</Text>
      <Text className="text-base text-muted">Sign in to your account</Text>

      <View className="w-full gap-3 pt-4">
        <TextInput
          className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900"
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!loading}
        />
        <TextInput
          className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900"
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          editable={!loading}
        />

        <Pressable
          className="mt-2 w-full rounded-xl bg-primary py-4 disabled:opacity-50"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-center text-base font-semibold text-white">
            {loading ? 'Signing in…' : 'Sign In'}
          </Text>
        </Pressable>
      </View>

      <Link href={{ pathname: '/(auth)/role-select', params: { role } }}>
        <Text className="text-sm text-primary">Don't have an account? Get started</Text>
      </Link>
    </View>
  );
}
