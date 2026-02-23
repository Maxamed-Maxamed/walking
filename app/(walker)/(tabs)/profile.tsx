import { Text, View } from 'react-native';

export default function WalkerProfileScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      <Text className="mt-1 text-sm text-muted">Manage your walker profile</Text>

      <View className="mt-6 items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-surface">
          <Text className="text-4xl">🦮</Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900">Dog Walker</Text>
        <Text className="text-sm text-muted">walker@example.com</Text>

        <View className="mt-2 rounded-xl border border-secondary px-4 py-2">
          <Text className="text-sm font-medium text-secondary">Edit Profile</Text>
        </View>
      </View>
    </View>
  );
}
