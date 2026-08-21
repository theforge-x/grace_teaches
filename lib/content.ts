import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { episodes, posts, series } from "@/db/schema";

const postWithRelations = { author: true, series: true } as const;

export async function getPublishedPosts() {
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: [desc(posts.publishedAt)],
    with: postWithRelations,
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.status, "published")),
    with: postWithRelations,
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
      with: postWithRelations,
    }),
    db.query.episodes.findMany({
      where: eq(episodes.status, "published"),
      orderBy: [desc(episodes.publishedAt)],
      limit,
    }),
  ]);
  return { latestPosts, latestEpisodes };
}

export async function getSeriesBySlug(slug: string) {
  return db.query.series.findFirst({ where: eq(series.slug, slug) });
}

export async function getPublishedSeriesPosts(seriesId: string) {
  return db.query.posts.findMany({
    where: and(eq(posts.seriesId, seriesId), eq(posts.status, "published")),
    orderBy: [asc(posts.seriesOrder), asc(posts.publishedAt)],
    with: postWithRelations,
  });
}

export async function getSeriesNeighbours(post: { id: string; seriesId: string | null }) {
  if (!post.seriesId) return { previous: null, next: null };

  const siblings = await getPublishedSeriesPosts(post.seriesId);
  const index = siblings.findIndex((sibling) => sibling.id === post.id);

  return {
    previous: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}

export async function getOtherPublishedPostsInSeries(post: {
  id: string;
  seriesId: string | null;
}) {
  if (!post.seriesId) return [];

  return db.query.posts.findMany({
    where: and(
      eq(posts.seriesId, post.seriesId),
      eq(posts.status, "published"),
      ne(posts.id, post.id),
    ),
    orderBy: [asc(posts.seriesOrder), asc(posts.publishedAt)],
    columns: { id: true, title: true, slug: true, seriesOrder: true },
  });
}
