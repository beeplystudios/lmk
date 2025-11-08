import { cuid2 } from "drizzle-cuid2/postgres";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const newsPostsTable = pgTable("news_posts", {
  id: cuid2("id").defaultRandom().primaryKey(),
  source: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 2000 }).notNull(),
  link: varchar({ length: 1000 }).notNull().unique(),
  image: varchar({ length: 1000 }),
});

export * from "./auth-schema";
