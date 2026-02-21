import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function RoleSelectScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-white px-6">
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 80, height: 80 }}
        contentFit="contain"
      />
      <Text className="text-2xl font-bold text-gray-900">How will you use DogWalker?</Text>
      <Text className="text-center text-sm text-muted">You can always add the other role later.</Text>

      <View className="w-full gap-4">
        <Link href="/(owner)/(tabs)/" asChild>
          <Pressable className="w-full rounded-2xl border-2 border-primary bg-white p-6">
            <Text className="text-xl">🐶</Text>
            <Text className="mt-2 text-lg font-semibold text-gray-900">I'm a Dog Owner</Text>
            <Text className="mt-1 text-sm text-muted">Find trusted walkers for my dogs</Text>
          </Pressable>
        </Link>

        <Link href="/(walker)/(tabs)/jobs" asChild>
          <Pressable className="w-full rounded-2xl border-2 border-secondary bg-white p-6">
            <Text className="text-xl">🦮</Text>
            <Text className="mt-2 text-lg font-semibold text-gray-900">I'm a Dog Walker</Text>
            <Text className="mt-1 text-sm text-muted">Earn money walking dogs near me</Text>
          </Pressable>
        </Link>

        <View className="w-full rounded-2xl border-2 border-gray-200 bg-white p-6 opacity-50">
          <Text className="text-xl">🤝</Text>
          <Text className="mt-2 text-lg font-semibold text-gray-900">Both</Text>
          <Text className="mt-1 text-sm text-muted">Coming soon</Text>
        </View>
      </View>
    </View>
  );
}
