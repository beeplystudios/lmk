import { cuid2 } from "drizzle-cuid2/postgres";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const post = pgTable("post", {
  id: cuid2("id").defaultRandom().primaryKey(),
  source: varchar("source", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  betterHeadline: varchar("better_headline", { length: 500 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  link: varchar("link", { length: 1000 }).notNull().unique(),
  image: varchar("image", { length: 1000 }),
  datePublished: timestamp("date_published"),
});

export * from "./auth-schema";
