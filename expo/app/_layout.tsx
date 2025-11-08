import { Stack } from "expo-router";

import "react-native-reanimated";

import "@/global.css";
import { queryClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// SystemUI.setBackgroundColorAsync("black");

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  // useEffect(() => {
  // Make the native system window background dark
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider value={DarkTheme}> */}
      {/* <View className="flex-1"> */}
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
