import { signOutOptions } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const signOut = useMutation(signOutOptions);

  if (!user.data) return <Redirect href="/" />;

  return (
    <SafeAreaView className="text-white p-3">
      <View className="flex items-center justify-between gap-4 flex-row">
        <Text className="text-white text-2xl font-medium">
          Good morning, {user.data?.name.split(" ")[0]}
        </Text>

        <Image
          source={{
            uri: user.data.image!,
          }}
          className="size-12 rounded-full"
        />
        {/* <Button title="Logout" onPress={() => signOut.mutate()} /> */}
      </View>
    </SafeAreaView>
  );
}
