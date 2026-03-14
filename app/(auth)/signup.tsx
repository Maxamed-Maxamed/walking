import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';
import { parseUserRole } from '@/lib/auth-context';
import type { UserRole } from '@/lib/auth-context';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { Button } from '@/components/ui/button';

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const role: UserRole = parseUserRole(params.role) ?? 'owner';

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
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: { data: { display_name: trimmedFullName || null } },
      });
      if (error) {
        Alert.alert('Signup failed', error.message);
      } else if (!data.session) {
        Alert.alert(
          'Check your email',
          'We sent a confirmation link. Confirm your email then sign in.',
          [
            {
              text: 'OK',
              onPress: () =>
                router.replace({ pathname: '/(auth)/login', params: { role } }),
            },
          ],
        );
      } else {
        router.replace({ pathname: '/(auth)/role-select', params: { role } });
      }
    } catch {
      Alert.alert('Signup failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const subtitle =
    role === 'owner'
      ? 'Sign up as a Dog Owner'
      : 'Sign up as a Dog Walker';

  return (
    <AuthScreenLayout
      title="DogWalker"
      subtitle={subtitle}
      footer={
        <Link href={{ pathname: '/(auth)/login', params: { role } }}>
          <Text className="text-sm text-primary">
            Already have an account? Sign in
          </Text>
        </Link>
      }>
      <TextInput
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink"
        placeholder="Full Name"
        placeholderTextColor="#94A3B8"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        editable={!loading}
      />
      <TextInput
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink"
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
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink"
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
      />
      <Button
        onPress={() => void handleSignup()}
        disabled={loading}
        className="mt-2 w-full">
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>
    </AuthScreenLayout>
  );
}
