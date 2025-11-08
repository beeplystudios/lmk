import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import "@/global.css";
import { queryClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { View } from "react-native";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// SystemUI.setBackgroundColorAsync("black");

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Make the native system window background dark
    SystemUI.setBackgroundColorAsync("#18181b");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider value={DarkTheme}> */}
      <View style={{ flex: 1, backgroundColor: "#18181b" }}>
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
      </View>

      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
