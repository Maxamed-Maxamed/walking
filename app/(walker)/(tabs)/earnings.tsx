import { Text, View } from 'react-native';

export default function EarningsScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Earnings</Text>
      <Text className="mt-1 text-sm text-muted">Your income & payouts</Text>

      <View className="mt-6 rounded-2xl bg-secondary p-6">
        <Text className="text-sm font-medium text-white opacity-80">Total Earned</Text>
        <Text className="mt-1 text-4xl font-bold text-white">$0.00</Text>
      </View>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">💰</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No earnings yet</Text>
        <Text className="mt-1 text-sm text-muted">Completed walks will show here</Text>
      </View>
    </View>
  );
}
