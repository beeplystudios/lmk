import { signOutOptions } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

const headlines = new Array(10).fill(0).map((_, idx) => ({
  id: idx + "",
  headline: "Lorem ipsum dolor sit amet consectetur sit amet",
  imgUrl:
    "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
}));

export default function HomeScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const signOut = useMutation(signOutOptions);

  if (!user.data) return <Redirect href="/" />;

  return (
    <SafeAreaView className="text-white p-4">
      <ScrollView>
        <View className="flex items-center justify-between gap-4 flex-row">
          <Text className="text-white text-2xl font-medium font-serif">
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

        <View className="my-16">
          <Text className="text-cyan-300 text-center mb-2 text-6xl font-semibold font-serif">
            LMK!
          </Text>
          <View className="flex flex-row mt-4">
            <TextInput className="h-16 pl-48 pr-12 text-lg grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs" />
            <Text className="absolute text-zinc-400 top-1/2 -translate-y-1/2 ml-4 text-lg font-serif">
              Let me know when
            </Text>
            <Pressable className="h-16 bg-[#CEF5E3] border-[0.0125rem] w-max min-w-12 px-2 border-full flex items-center justify-center rounded-r-full">
              <Text className="font-medium">
                <Ionicons name="add-circle" size={24} />
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="pb-24 flex flex-col gap-8">
          {headlines.map((headline) => (
            <View key={headline.id}>
              <Image
                source={{
                  uri: headline.imgUrl,
                  width: 400,
                  height: 200,
                }}
                className="w-full object-cover rounded-xl"
              />
              <Text className="text-white text-xl font-medium mt-4">
                {headline.headline}
              </Text>
              <Text className="text-zinc-300 te">
                {headline.description.slice(0, 80)}...
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
