import { expoClient } from "@better-auth/expo/client";
import { mutationOptions } from "@tanstack/react-query";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "lmk",
      storagePrefix: "lmk",
      storage: SecureStore,
    }),
  ],
});

export const signInOptions = mutationOptions({
  mutationKey: ["user-sign-in"],
  mutationFn: async () => {
    const res = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/(tabs)/home",
    });

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});

export const signOutOptions = mutationOptions({
  mutationKey: ["user-sign-out"],
  mutationFn: async () => {
    const res = await authClient.signOut();

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});
