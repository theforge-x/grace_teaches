import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { episodes, posts } from "@/db/schema";

export async function getPublishedPosts() {
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: [desc(posts.publishedAt)],
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.status, "published")),
  });
}

export async function getPublishedEpisodes() {
  return db.query.episodes.findMany({
    where: eq(episodes.status, "published"),
    orderBy: [desc(episodes.publishedAt)],
  });
}

export async function getPublishedEpisodeBySlug(slug: string) {
  return db.query.episodes.findFirst({
    where: and(eq(episodes.slug, slug), eq(episodes.status, "published")),
  });
}

export async function getLatestPublished(limit = 3) {
  const [latestPosts, latestEpisodes] = await Promise.all([
    db.query.posts.findMany({
      where: eq(posts.status, "published"),
      orderBy: [desc(posts.publishedAt)],
      limit,
    }),
    db.query.episodes.findMany({
      where: eq(episodes.status, "published"),
      orderBy: [desc(episodes.publishedAt)],
      limit,
    }),
  ]);
  return { latestPosts, latestEpisodes };
}
