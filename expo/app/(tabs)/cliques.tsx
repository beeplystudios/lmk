import { trpc } from "@/lib/trpc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TRPCRouterOutputs } from "@lmk/server";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
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

const CliqueCard = ({
  clique,
  lmks,
  userCount,
}: TRPCRouterOutputs["clique"]["list"][number]) => {
  const users = useSuspenseQuery(
    trpc.clique.getUsers.queryOptions({
      cliqueId: clique.id,
    })
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [email, setEmail] = useState("");
  const invite = useMutation(trpc.clique.invite.mutationOptions());

  return (
    <>
      <Pressable
        className="p-4 bg-zinc-800 w-full rounded-xl"
        onPress={() => actionSheetRef.current?.show()}
      >
        <Text className="text-white text-lg font-medium">{clique.name}</Text>
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="people" size={16} color="white" />
          <Text className="text-white">
            {userCount} Member{userCount === 1 ? "" : "s"}
          </Text>
          <Text className="text-white">
            {lmks.length} LMK{userCount === 1 ? "" : "s"}
          </Text>
        </View>
      </Pressable>

      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        containerStyle={{
          backgroundColor: "#27272a",
          height: "80%",
        }}
      >
        <View className="p-4 gap-4">
          <View className="flex flex-col">
            <View>
              <Text className="text-white text-2xl font-medium">
                {clique.name}
              </Text>
              <Text className="text-stone-400 my-1">Manage your clique</Text>
            </View>
          </View>
          <View>
            <View className="py-4 flex flex-col gap-4">
              <View>
                <Text className="mb-1 text-white font-medium">
                  Email Address
                </Text>
                <Text className="mb-2 font-medium text-stone-400">
                  The user you are inviting must already have an LMK account!
                </Text>

                <View className="flex flex-row gap-4">
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Add someone to your clique"
                    placeholderClassName="text-lg text-zinc-200"
                    className="h-12 shadow-sm px-4 text-lg grow text-zinc-200 bg-zinc-700 rounded-2xl border-[0.0125rem] border-zinc-300/70"
                  />
                  <Pressable
                    className="h-12 bg-[#CEF5E3] px-4 gap-2 flex flex-row items-center justify-center rounded-2xl shadow-sm border-[0.0125rem] border-blue-100 active:scale-95"
                    onPress={() => invite.mutate({ email })}
                  >
                    <Text className="font-semibold text-xl">Invite</Text>
                    {/* <Ionicons name="add" size={24} color="black" /> */}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          {users.data.map((user) => (
            <View
              key={user.id}
              className="bg-zinc-700/50 p-4 rounded-md flex flex-row gap-4 items-center"
            >
              <Image
                source={{ uri: user.image! }}
                className="size-12 rounded-full"
              />
              <View>
                <Text className="text-white text-lg font-medium">
                  {user.name}
                </Text>
                <Text className="text-stone-300">{user.email}</Text>
              </View>
            </View>
          ))}
        </View>
      </ActionSheet>
    </>
  );
};

export default function CliquesScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [name, setName] = useState("");

  const cliques = useQuery(trpc.clique.list.queryOptions());

  const create = useMutation(
    trpc.clique.create.mutationOptions({
      onMutate() {
        actionSheetRef.current?.hide();
      },
      onSuccess() {
        return cliques.refetch();
      },
    })
  );

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
            className="w-full rounded-md bg-zinc-600 flex items-center justify-center py-4 absolute bottom-0"
          >
            <Text className=" text-white ">+ Add Clique</Text>
          </Pressable>

          {/* <Text className="text-white">
            {JSON.stringify(cliques.data, null, 2)}
          </Text> */}
          <View className="flex flex-col gap-4 w-full">
            {cliques.data?.map((item) => (
              <View key={item.clique.id}>
                <CliqueCard {...item} />
              </View>
            ))}
          </View>

          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled
            containerStyle={{
              backgroundColor: "#27272a",
              // height: "45%",
            }}
          >
            <View className="p-6">
              <View className="flex flex-col items-center gap-2">
                <Ionicons name="people-circle-sharp" size={48} color="white" />

                <View>
                  <Text className="text-white text-center text-2xl font-medium">
                    Create a Clique
                  </Text>
                  <Text className="text-stone-400 my-2 text-center">
                    Share your LMKs with your friends keep up to date with the
                    news you care about together!
                  </Text>
                </View>
              </View>
              <View className="py-4 flex flex-col gap-4">
                <View className="mb-4">
                  <Text className="mb-2 text-white font-medium">Name</Text>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Let me know when..."
                    placeholderClassName="text-lg text-zinc-200"
                    className="h-12 shadow-sm px-4 text-lg grow text-zinc-200 bg-zinc-700 rounded-2xl border-[0.0125rem] border-zinc-300/70"
                  />
                </View>

                <Pressable
                  className="bg-[#CEF5E3] py-3 gap-2 flex flex-row items-center justify-center rounded-full shadow-sm border-[0.0125rem] border-blue-100 active:scale-95"
                  onPress={() => create.mutate({ name })}
                >
                  <Text className="font-semibold text-xl">Create</Text>
                  <Ionicons name="add" size={24} color="black" />
                </Pressable>
              </View>
            </View>
          </ActionSheet>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
