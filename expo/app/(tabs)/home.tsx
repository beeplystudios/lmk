import { trpc } from "@/lib/trpc";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  TextInput,
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

const CreateLmkForm: React.FC = () => {
  const [lmk, setLmk] = useState("");
  const queryClient = useQueryClient();
  const create = useMutation(trpc.lmk.create.mutationOptions());
  const lmkList = useQuery(trpc.lmk.list.queryOptions({}));

  return (
    <View
      // style={{ paddingTop: 64 }}
      onLayout={(e) => {
        // viewY.current = e.nativeEvent.layout.y;
      }}
      className="flex flex-row pb-8"
    >
      <TextInput
        value={lmk}
        onChangeText={setLmk}
        placeholder="Let me know when..."
        className="h-24 shadow-sm px-8 text-2xl grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs placeholder:text-zinc-300"
      />

      <Pressable
        className={`h-24 border-[0.0125rem] w-max min-w-24 px-2 border-full flex items-center justify-center rounded-r-full active:scale-95 ${
          create.isPending || lmkList.isLoading || lmk.trim() === ""
            ? "bg-zinc-600"
            : "bg-[#CEF5E3]"
        }`}
        onPress={async () => {
          await create.mutateAsync({ query: lmk });
          await lmkList.refetch();
          setLmk("");
        }}
        disabled={create.isPending || lmkList.isLoading || lmk.trim() === ""}
      >
        <Text className="font-medium">
          <Ionicons name="add" size={24} />
        </Text>
      </Pressable>
    </View>
  );
};

export default function AnimatedStickyHeader() {
  const [lmk, setLmk] = useState("");
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const lmkList = useSuspenseQuery(trpc.lmk.list.queryOptions({}));
  const create = useMutation(
    trpc.lmk.create.mutationOptions({
      onSettled: () => lmkList.refetch(),
    })
  );

  if (!user.data) return <Redirect href="/" />;

  return (
    <View className="p-4 min-h-screen" style={{ backgroundColor: "#18181b" }}>
      <Animated.ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="flex items-center justify-between gap-4 flex-row pt-24">
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
          <Text className="text-stone-50 mb-2 text-4xl font-semibold font-serif mt-10">
            LetMeKnow!
          </Text>
        </View>
        <View className="pt-12">
          <View
            // style={{ paddingTop: 64 }}
            className="flex flex-row pb-8"
          >
            <TextInput
              value={lmk}
              onChangeText={setLmk}
              placeholder="Let me know when..."
              className="h-24 shadow-sm px-8 text-lg grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs placeholder:text-zinc-300"
            />

            <Pressable
              className="h-24 bg-[#CEF5E3] border-[0.0125rem] w-max min-w-24 px-2 border-full flex items-center justify-center rounded-r-full active:scale-95"
              onPress={() => {
                console.log(lmk);
                create.mutate({ query: lmk });
                // console.log(lmk);
                setLmk("");
              }}
            >
              <Text className="font-medium">
                <Ionicons name="add" size={24} />
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex flex-col gap-4 pb-32">
          <Text className="text-white font-medium font-serif text-xl -mb-2">
            Your LMKs
          </Text>
          {lmkList.data
            .map((lmk) => ({ ...lmk, answered: lmk.answer !== undefined }))
            // .sort((a, b) => (a.answered ? -1 : 1))
            .map((lmk) => (
              <View
                key={lmk.id}
                className="relative shadow-sm flex flex-col p-4 gap-4 bg-zinc-800 rounded-2xl my-2"
              >
                <View className="flex-[3] flex flex-row items-center justify-between gap-1">
                  <View>
                    <Text className="font-serif text-stone-400">
                      {lmk.answered
                        ? "You asked us to you let you know when..."
                        : "Let me know when..."}
                    </Text>
                    <Text className="text-white text-xl font-medium">
                      {lmk.query}
                    </Text>
                  </View>
                  {lmk.answered ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#86efac"
                    />
                  ) : (
                    <Ionicons name="time" size={24} color="#fde68a" />
                  )}
                </View>
                {/* {
                  <Text className="text-white">
                    {JSON.stringify(lmk.answer, null, 2)}
                  </Text>
                } */}
                {lmk.answered && (
                  <View>
                    <Text className="text-stone-400 font-serif">
                      On January 1st, 2026:{" "}
                    </Text>
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
                          {lmk.answer?.fields.title}
                        </Text>
                        <Text className="text-zinc-400">
                          {lmk.answer?.fields.description}
                        </Text>
                        <Text className="text-stone-400 mt-2">
                          From the {lmk.answer?.fields.source}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          {lmkList.data.length === 0 && (
            <Text className="text-zinc-400 italic">
              You have no LMKs yet. Create one above!
            </Text>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
