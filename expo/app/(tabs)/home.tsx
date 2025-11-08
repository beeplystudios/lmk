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
import { useState } from "react";

const headlines = new Array(10).fill(0).map((_, idx) => ({
  id: idx + "",
  headline: "Lorem ipsum dolor sit amet consectetur sit amet",
  imgUrl:
    "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
}));

export default function HomeScreen() {
  const [lmk, setLmk] = useState("");
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const create = useMutation(trpc.lmk.create.mutationOptions());
  const lmkList = useSuspenseQuery(trpc.lmk.list.queryOptions({}));

  if (!user.data) return <Redirect href="/" />;

  return (
    <SafeAreaView className="text-white p-4">
      <ScrollView stickyHeaderIndices={[1]}>
        <View className="flex items-center justify-between gap-4 flex-row">
          <Text className="text-stone-400 text-2xl font-medium font-serif">
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
          <Text className="text-stone-50 mb-2 text-4xl font-semibold font-serif">
            LetMeKnow!
          </Text>
          <View className="flex flex-row mt-4">
            <TextInput
              className="h-16 pl-48 pr-12 text-lg grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs"
              value={lmk}
              onChangeText={(newText) => setLmk(newText)}
            />
            <Text className="absolute text-zinc-400 top-1/2 -translate-y-1/2 ml-4 text-lg font-serif">
              Let me know when
            </Text>
            <Pressable
              className="h-16 bg-[#CEF5E3] border-[0.0125rem] w-max min-w-12 px-2 border-full flex items-center justify-center rounded-r-full"
              onPress={() => {
                create.mutate({ query: lmk });
                console.log(lmk);
                setLmk("");
              }}
            >
              <Text className="font-medium">
                <Ionicons name="add" size={24} />
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="pb-24 flex flex-col gap-4">
          <Text className="text-white font-medium font-serif text-xl -mb-2">
            Your LMKs
          </Text>
          {lmkList.data.map((lmk) => (
            <View
              key={lmk.id}
              className="relative shadow-sm flex flex-row items-start p-4 gap-4 bg-zinc-800 rounded-2xl"
            >
              <View className="flex">
                <Text className="text-white text-xl font-medium break-words">
                  {lmk.query}
                </Text>
              </View>
            </View>
          ))}
          {lmkList.data.length === 0 && (
            <Text className="text-zinc-400 italic">
              You have no LMKs yet. Create one above!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
