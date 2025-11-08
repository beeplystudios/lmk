import { signOutOptions } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const signOut = useMutation(signOutOptions);

  if (!user.data) return <Redirect href="/" />;

  return (
    <SafeAreaView className="text-white">
      <Text>Hi {user.data?.name}</Text>

      <Button title="Logout" onPress={() => signOut.mutate()} />
    </SafeAreaView>
  );
}
