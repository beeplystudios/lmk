import type { AppRouter } from "@lmk/server";

import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { authClient } from "./auth-client";

export const queryClient = new QueryClient();

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!EXPO_PUBLIC_API_URL) throw "process.env.EXPO_PUBLIC_API_URL is not set";

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${EXPO_PUBLIC_API_URL}/api/trpc`,
      headers() {
        const headers = new Map<string, string>();

        const cookies = authClient.getCookie();

        if (cookies) {
          headers.set("Cookie", cookies);
        }

        return Object.fromEntries(headers);
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
