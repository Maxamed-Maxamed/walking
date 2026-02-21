import { Text, View } from 'react-native';

export default function MyDogsScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">My Dogs</Text>
      <Text className="mt-1 text-sm text-muted">Manage your dog profiles</Text>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">🐶</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No dogs added yet</Text>
        <Text className="mt-1 text-sm text-muted">Add your first dog to get started</Text>

        <View className="mt-6 rounded-xl bg-primary px-6 py-3">
          <Text className="font-semibold text-white">+ Add Dog</Text>
        </View>
      </View>
    </View>
  );
}
