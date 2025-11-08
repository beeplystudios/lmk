import { signInOptions } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const signIn = useMutation(signInOptions);

  if (user.data) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <SafeAreaView>
      <Button title="Login with Google" onPress={() => signIn.mutate()} />
    </SafeAreaView>
  );
}
