import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

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

export const lmk = pgTable("lmk", {
  id: cuid2("id").defaultRandom().primaryKey(),
  query: varchar("query", { length: 250 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clique = pgTable("clique", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  creatorId: varchar("creator_id").notNull(),
});

export const cliqueRelations = relations(clique, ({ many }) => ({
  members: many(cliqueUser),
}));

export const usersRelations = relations(user, ({ many }) => ({
  cliques: many(cliqueUser),
}));

export const cliqueUser = pgTable(
  "clique_user",
  {
    cliqueId: varchar("clique_id")
      .notNull()
      .references(() => clique.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.cliqueId, t.userId] })]
);

export const cliqueUserRelations = relations(cliqueUser, ({ one }) => ({
  clique: one(clique, {
    fields: [cliqueUser.cliqueId],
    references: [clique.id],
  }),
  user: one(user, {
    fields: [cliqueUser.userId],
    references: [user.id],
  }),
}));

export * from "./auth-schema";
