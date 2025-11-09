import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  if (!user.data) return <Redirect href="/" />;

  return (
    <ScrollView stickyHeaderIndices={[1]}>
      <SafeAreaView
        className="text-white p-4 min-h-screen"
        style={{ backgroundColor: "#18181b" }}
      >
        <View className="flex items-center justify-between gap-4 flex-row mb-8">
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
          {/* <Text>{JSON.stringify(data.data, null, 2)}</Text> */}
          {data.data.map((lmk) => (
            <View key={lmk._id} className="bg-zinc-800 p-4 rounded-xl">
              <View className="flex flex-row gap-4 my-4">
                {/* <Image
                        source={{
                          uri: "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
                          width: 100,
                          height: 50,
                        }}
                        className="flex-1 h-full object-cover rounded-md"
                      /> */}
                <View className="flex-[2]">
                  <Text className="text-white text-lg font-medium font-serif">
                    {lmk.fields.title}
                  </Text>
                  <Text className="text-zinc-400">
                    {lmk.fields.description}
                  </Text>
                  <Text className="text-stone-400 mt-2">
                    From the {lmk.fields.source}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          {/* {headlines.map((headline) => (
            <View
              key={headline.id}
              className="relative shadow-sm flex flex-row items-start p-4 gap-4 bg-zinc-800 rounded-2xl"
            >
              <Image
                source={{
                  uri: headline.imgUrl,
                  width: 50,
                  height: 30,
                }}
                className="w-32 h-full object-cover rounded-xl"
              />

              <View className="flex">
                <Text className="text-white text-xl font-medium break-words">
                  {headline.headline}
                </Text>
                <Text className="text-zinc-100 te">
                  {headline.description.slice(0, 80)}...
                </Text>
              </View>
            </View>
          ))} */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
