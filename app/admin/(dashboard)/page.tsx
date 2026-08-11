import { count } from "drizzle-orm";
import { ArrowRight, Mic, Newspaper, PenSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { episodes, posts } from "@/db/schema";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [postStats, episodeStats] = await Promise.all([
    db.select({ status: posts.status, total: count() }).from(posts).groupBy(posts.status),
    db.select({ status: episodes.status, total: count() }).from(episodes).groupBy(episodes.status),
  ]);

  const publishedPosts = postStats.find((s) => s.status === "published")?.total ?? 0;
  const draftPosts = postStats.find((s) => s.status === "draft")?.total ?? 0;
  const publishedEpisodes = episodeStats.find((s) => s.status === "published")?.total ?? 0;
  const draftEpisodes = episodeStats.find((s) => s.status === "draft")?.total ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">A quick look at what's live and what's waiting.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper-raised/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ink">
              <Newspaper className="h-4 w-4 text-rust" />
              <h2 className="font-display font-semibold">Blog Posts</h2>
            </div>
            <Link href="/admin/posts" className="text-ink-faint hover:text-rust">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-2xl font-semibold text-ink">{publishedPosts}</p>
              <p className="text-xs uppercase tracking-wide text-ink-faint">Published</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{draftPosts}</p>
              <p className="text-xs uppercase tracking-wide text-ink-faint">Drafts</p>
            </div>
          </div>
          <LinkButton href="/admin/posts/new" size="sm" variant="secondary" className="mt-5">
            <PenSquare className="h-3.5 w-3.5" /> New post
          </LinkButton>
        </div>

        <div className="rounded-2xl border border-line bg-paper-raised/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ink">
              <Mic className="h-4 w-4 text-rust" />
              <h2 className="font-display font-semibold">Podcast Episodes</h2>
            </div>
            <Link href="/admin/episodes" className="text-ink-faint hover:text-rust">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-2xl font-semibold text-ink">{publishedEpisodes}</p>
              <p className="text-xs uppercase tracking-wide text-ink-faint">Published</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{draftEpisodes}</p>
              <p className="text-xs uppercase tracking-wide text-ink-faint">Drafts</p>
            </div>
          </div>
          <LinkButton href="/admin/episodes/new" size="sm" variant="secondary" className="mt-5">
            <PenSquare className="h-3.5 w-3.5" /> New episode
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
