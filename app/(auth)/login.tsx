import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-3xl font-bold text-primary">🐾 DogWalker</Text>
      <Text className="text-base text-muted">Sign in to your account</Text>

      <View className="w-full gap-3 pt-4">
        <View className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3">
          <Text className="text-sm text-muted">Email</Text>
        </View>
        <View className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3">
          <Text className="text-sm text-muted">Password</Text>
        </View>

        <View className="mt-2 w-full rounded-xl bg-primary py-4">
          <Text className="text-center text-base font-semibold text-white">Sign In</Text>
        </View>
      </View>

      <Link href="/(auth)/signup">
        <Text className="text-sm text-primary">Don't have an account? Sign up</Text>
      </Link>
    </View>
  );
}
