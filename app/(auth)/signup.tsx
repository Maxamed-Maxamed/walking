import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function SignupScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-3xl font-bold text-primary">🐾 DogWalker</Text>
      <Text className="text-base text-muted">Create your account</Text>

      <View className="w-full gap-3 pt-4">
        <View className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3">
          <Text className="text-sm text-muted">Full Name</Text>
        </View>
        <View className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3">
          <Text className="text-sm text-muted">Email</Text>
        </View>
        <View className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3">
          <Text className="text-sm text-muted">Password</Text>
        </View>

        <Link href="/(auth)/role-select" asChild>
          <View className="mt-2 w-full rounded-xl bg-primary py-4">
            <Text className="text-center text-base font-semibold text-white">Create Account</Text>
          </View>
        </Link>
      </View>

      <Link href="/(auth)/login">
        <Text className="text-sm text-primary">Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}
