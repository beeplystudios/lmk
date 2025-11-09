import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CliquesScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  if (!user.data) return <Redirect href="/" />;

  return (
    <SafeAreaView
      className="text-white p-4 min-h-screen"
      style={{ backgroundColor: "#18181b" }}
    >
      <ScrollView stickyHeaderIndices={[1]}>
        <View className="flex items-center justify-between gap-4 flex-row mb-8">
          <Text className="text-white font-bold font-serif text-4xl">
            Cliques
          </Text>

          <Image
            source={{
              uri: user.data.image!,
            }}
            className="size-12 rounded-full"
          />
          {/* <Button title="Logout" onPress={() => signOut.mutate()} /> */}
        </View>

        <View className="pb-24 flex flex-col gap-4">
          <Pressable
            onPress={() => 0}
            className="w-full rounded-md bg-zinc-600 flex items-center justify-center py-4"
          >
            <Text className=" text-white ">+ Add Clique</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
