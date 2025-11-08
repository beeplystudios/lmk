import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const user = useSuspenseQuery(trpc.me.queryOptions());

  const handleLogin = async () => {
    console.log("AAA");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
    });
  };

  return (
    <SafeAreaView>
      <Button title="Login with Google" onPress={handleLogin} />
      {user.data && <Text>Hi {user.data.name}</Text>}
    </SafeAreaView>
  );
}
