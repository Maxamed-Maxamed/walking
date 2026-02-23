import { Text, View } from 'react-native';

export default function BrowseWalkersScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Find a Walker</Text>
      <Text className="mt-1 text-sm text-muted">Browse dog walkers near you</Text>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">🔍</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No walkers yet</Text>
        <Text className="mt-1 text-sm text-muted">Walker profiles will appear here</Text>
      </View>
    </View>
  );
}
