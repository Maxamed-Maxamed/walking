import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/lib/auth-context';
import { parseUserRole } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const role: UserRole = parseUserRole(params.role) ?? 'owner';

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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        Alert.alert('Login failed', error.message);
      } else {
        // Successfully logged in - set active role and let auth context navigate
        switchRole(role);
      }
    } catch {
      Alert.alert('Login failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout
      title="DogWalker"
      subtitle="Sign in to your account"
      footer={
        <Link href={{ pathname: '/(auth)/role-select', params: { role } }}>
          <Text className="text-sm text-primary">
            Don&apos;t have an account? Get started
          </Text>
        </Link>
      }>
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
        autoComplete="current-password"
        editable={!loading}
      />
      <Button
        onPress={() => void handleLogin()}
        disabled={loading}
        className="mt-2 w-full">
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </AuthScreenLayout>
  );
}
