import { Text, View } from 'react-native';

export default function ScheduleScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-gray-900">Schedule</Text>
      <Text className="mt-1 text-sm text-muted">Your upcoming walks & availability</Text>

      <View className="mt-6 flex-1 items-center justify-center">
        <Text className="text-4xl">📅</Text>
        <Text className="mt-3 text-base font-medium text-gray-700">No walks scheduled</Text>
        <Text className="mt-1 text-sm text-muted">Set your availability to start getting bookings</Text>

        <View className="mt-6 rounded-xl bg-secondary px-6 py-3">
          <Text className="font-semibold text-white">Set Availability</Text>
        </View>
      </View>
    </View>
  );
}
