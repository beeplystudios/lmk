import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || typeof DATABASE_URL !== "string")
  throw new Error("DATABASE_URL is not defined");

export const db = drizzle(DATABASE_URL);
