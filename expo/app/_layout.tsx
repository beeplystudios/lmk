import "@/global.css";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { queryClient, trpc } from "@/lib/trpc";
import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// SystemUI.setBackgroundColorAsync("black");

const SaveToken = () => {
  const saveToken = useMutation(trpc.expoPushToken.mutationOptions());

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      // send the token to the server !!!
      // probably never actually nonexistent when non-erroring but whatevs
      if (token) saveToken.mutate({ token });
    });
  }, []);

  return null;
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  // useEffect(() => {
  // Make the native system window background dark
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider value={DarkTheme}> */}
      {/* <View className="flex-1"> */}
      <SaveToken />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {/* <StatusBar style="light" /> */}
      {/* </View> */}

      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
