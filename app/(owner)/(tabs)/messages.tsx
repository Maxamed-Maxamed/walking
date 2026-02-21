import { Text, View } from 'react-native';

export default function OwnerMessagesScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Messages</Text>
      <Text className="mt-1 text-sm text-muted">Chat with your dog walkers</Text>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">💬</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No messages yet</Text>
        <Text className="mt-1 text-sm text-muted">Messages with walkers will appear here</Text>
      </View>
    </View>
  );
}
