import { trpc } from "@/lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data } = useSuspenseQuery(
    trpc.greet.queryOptions({
      name: "Nirjhor",
    })
  );

  return (
    <SafeAreaView className="text-white">
      <Text className="text-white">{data}</Text>
    </SafeAreaView>
  );
}
