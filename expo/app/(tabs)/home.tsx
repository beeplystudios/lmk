import { LmkCard } from "@/components/ui/cards";
import { trpc } from "@/lib/trpc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AnimatedStickyHeader() {
  const [lmk, setLmk] = useState("");
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const lmkList = useSuspenseQuery(trpc.lmk.list.queryOptions({}));

  const create = useMutation(
    trpc.lmk.create.mutationOptions({
      onMutate: () => Keyboard.dismiss(),
      onSettled: () => lmkList.refetch(),
    })
  );

  const onRefresh = useCallback(async () => {
    await lmkList.refetch();
  }, []);

  if (!user.data) return <Redirect href="/" />;

  return (
    <View className="p-4 min-h-screen" style={{ backgroundColor: "#18181b" }}>
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={lmkList.isLoading}
            onRefresh={onRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
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
            Let Me Know!
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
              placeholderClassName="text-lg text-zinc-200"
              className="h-16 shadow-sm px-8 text-lg grow overflow-scroll flex-1 text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 border-r-0 shadow-xs"
            />

            <Pressable
              className="h-16 bg-[#CEF5E3] border-[0.0125rem] w-20 px-2 border-full flex items-center justify-center rounded-r-full active:scale-95"
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

        <View className="flex flex-col gap-2 pb-32">
          <Text className="text-white font-medium font-serif text-xl -mb-2">
            Your LMKs
          </Text>
          {lmkList.data
            .map((lmk) => ({ ...lmk, answered: lmk.answer !== undefined }))
            // .sort((a, b) => (a.answered ? -1 : 1))
            .map((lmk) => (
              <LmkCard lmk={lmk} key={lmk.id} />
            ))}
          {lmkList.data.length === 0 && (
            <Text className="text-zinc-400 italic">
              You have no LMKs yet. Create one above!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
