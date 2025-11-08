import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!EXPO_PUBLIC_API_URL) throw "process.env.EXPO_PUBLIC_API_URL not set";
if (!BETTER_AUTH_SECRET) throw "process.env.BETTER_AUTH_SECRET not set";
if (!GOOGLE_CLIENT_ID) throw "process.env.GOOGLE_CLIENT_ID not set";
if (!GOOGLE_CLIENT_SECRET) throw "process.env.GOOGLE_CLIENT_SECRET not set";

export const auth = betterAuth({
  baseURL: EXPO_PUBLIC_API_URL,
  secret: BETTER_AUTH_SECRET,
  plugins: [expo()],
  trustedOrigins: ["lmk://", "lmk://*"],
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
});
