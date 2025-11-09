import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const headlines = new Array(10).fill(0).map((_, idx) => ({
  id: idx + "",
  headline: "Lorem ipsum dolor sit amet consectetur sit amet",
  imgUrl:
    "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
}));

export default function ExploreScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const data = useSuspenseQuery(trpc.lmk.explore.queryOptions({}));

  const onRefresh = useCallback(async () => {
    await data.refetch();
  }, []);

  if (!user.data) return <Redirect href="/" />;

  return (
    <View
      className="text-white p-4 min-h-screen"
      style={{ backgroundColor: "#18181b" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={data.isLoading} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex items-center justify-between gap-4 flex-row mb-8 pt-24">
          <Text className="text-white font-bold font-serif text-4xl">
            Explore
          </Text>

          <Image
            source={{
              uri: user.data.image!,
            }}
            className="size-12 rounded-full"
          />
        </View>

        <View className="pb-24 flex flex-col gap-4">
          {data.data.map((lmk) => (
            <Pressable
              key={lmk.id}
              onPress={() => {
                const link = lmk?.link ?? "";
                if (link) {
                  WebBrowser.openBrowserAsync(link);
                }
              }}
            >
              <View className="bg-zinc-800 rounded-xl relative">
                <View className="flex flex-col gap-4">
                  {lmk.image && (
                    <Image
                      source={{
                        uri: lmk.image,
                        width: 500,
                        height: 400,
                      }}
                      className="w-full object-cover rounded-xl"
                    />
                  )}
                  <View
                    className={
                      !lmk.image
                        ? "p-4"
                        : "absolute bg-black/80 bottom-0 p-4 w-full rounded-b-xl"
                    }
                  >
                    <Text className="text-white text-lg font-medium font-serif">
                      {lmk.title}
                    </Text>
                    <Text className="text-zinc-400">{lmk.description}</Text>
                    <Text className="text-stone-400 mt-2">
                      From the {lmk.source}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
          {data.data.length === 0 && (
            <Text className="text-zinc-400 italic">
              You have no suggestions yet. Try creating an LMK!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
