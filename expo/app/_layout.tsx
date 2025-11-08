import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import "@/global.css";
import { queryClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SystemUI from "expo-system-ui";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

SystemUI.setBackgroundColorAsync("black");

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider value={DarkTheme}> */}
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "#18181b",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
