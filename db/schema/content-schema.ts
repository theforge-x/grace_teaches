import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);

export const series = pgTable("series", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull().default(""),
  scripture: varchar("scripture", { length: 120 }),
  coverImageUrl: text("cover_image_url"),
  status: contentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  seriesId: uuid("series_id").references(() => series.id, { onDelete: "set null" }),
  seriesOrder: integer("series_order"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description"),
  scripture: varchar("scripture", { length: 120 }),
  audioUrl: text("audio_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  durationSeconds: integer("duration_seconds"),
  season: integer("season").notNull().default(1),
  episodeNumber: integer("episode_number"),
  status: contentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(user, { fields: [posts.authorId], references: [user.id] }),
  series: one(series, { fields: [posts.seriesId], references: [series.id] }),
}));

export const seriesRelations = relations(series, ({ many }) => ({
  posts: many(posts),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
  author: one(user, { fields: [episodes.authorId], references: [user.id] }),
}));
