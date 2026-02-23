import { Text, View } from 'react-native';

export default function JobsScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Available Jobs</Text>
      <Text className="mt-1 text-sm text-muted">Walk requests near you</Text>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">🦮</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No jobs available</Text>
        <Text className="mt-1 text-sm text-muted">New walk requests will appear here</Text>
      </View>
    </View>
  );
}
