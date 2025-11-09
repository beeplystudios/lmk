import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CliquesScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const [modalVisible, setModalVisible] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);

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

        <View className="pb-24 flex flex-col gap-4 items-center justify-center ">
          <Pressable
            onPress={() => actionSheetRef.current?.show()}
            className="w-full rounded-md bg-zinc-600 flex items-center justify-center py-4"
          >
            <Text className=" text-white ">+ Add Clique</Text>
          </Pressable>
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled
            containerStyle={{
              backgroundColor: "#27272a",
              // height: "45%",
            }}
          >
            <View className="p-4">
              <Text className="text-white text-2xl font-medium">
                Create a Clique
              </Text>
              <View className="py-4 flex flex-col gap-4">
                <Text className="mb-1 text-white font-medium">Name</Text>
                <TextInput
                  placeholderClassName="text-lg text-zinc-200"
                  style={{ lineHeight: 0 }}
                  className="h-16 shadow-sm px-8 text-lg grow text-zinc-200 bg-zinc-700 rounded-xl border-[0.0125rem] border-zinc-300/70 border-r-0 shadow-xs"
                />

                <Pressable className="bg-[#CEF5E3] py-4 flex items-center justify-center rounded-full shadow-sm border-[0.0125rem] border-blue-100 active:scale-95">
                  <Text className="font-medium text-lg">Create</Text>
                </Pressable>
              </View>
            </View>
          </ActionSheet>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
