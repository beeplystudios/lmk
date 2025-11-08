import type { AppRouter } from "@lmk/server";

import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

export const queryClient = new QueryClient();

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!EXPO_PUBLIC_API_URL) throw "process.env.EXPO_PUBLIC_API_URL is not set";

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `${EXPO_PUBLIC_API_URL}/api/trpc` })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
