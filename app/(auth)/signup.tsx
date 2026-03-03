import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/auth-context';

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params.role ?? 'owner') as UserRole;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedFullName = fullName.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: { data: { display_name: trimmedFullName || null } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Signup failed', error.message);
    } else if (!data.session) {
      // Email confirmation required
      Alert.alert(
        'Check your email',
        'We sent a confirmation link. Confirm your email then sign in.',
        [{ text: 'OK', onPress: () => router.replace({ pathname: '/(auth)/login', params: { role } }) }],
      );
    } else {
      // Session immediately available — go back to role-select to auto-continue
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
      <Text className="text-base text-muted">
        {role === 'owner' ? 'Sign up as a Dog Owner' : 'Sign up as a Dog Walker'}
      </Text>

      <View className="w-full gap-3 pt-4">
        <TextInput
          className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900"
          placeholder="Full Name"
          placeholderTextColor="#94A3B8"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          editable={!loading}
        />
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
          autoComplete="new-password"
          editable={!loading}
        />

        <Pressable
          className="mt-2 w-full rounded-xl bg-primary py-4 disabled:opacity-50"
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-center text-base font-semibold text-white">
            {loading ? 'Creating account…' : 'Create Account'}
          </Text>
        </Pressable>
      </View>

      <Link href={{ pathname: '/(auth)/login', params: { role } }}>
        <Text className="text-sm text-primary">Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}
