import { desc } from "drizzle-orm";
import { PenSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { deleteEpisode } from "@/lib/actions/episodes";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Podcast Episodes", robots: { index: false } };

export default async function AdminEpisodesPage() {
  const allEpisodes = await db.query.episodes.findMany({
    orderBy: [desc(episodes.createdAt)],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Podcast Episodes</h1>
          <p className="mt-1 text-sm text-ink-soft">{allEpisodes.length} total</p>
        </div>
        <LinkButton href="/admin/episodes/new" size="sm">
          <PenSquare className="h-3.5 w-3.5" /> New episode
        </LinkButton>
      </div>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper-raised/40">
        {allEpisodes.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No episodes yet. Create your first one.
          </p>
        ) : (
          allEpisodes.map((episode) => (
            <div key={episode.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/episodes/${episode.id}`}
                    className="truncate font-medium text-ink hover:text-rust"
                  >
                    S{episode.season}E{episode.episodeNumber ?? "—"} · {episode.title}
                  </Link>
                  <Badge tone={episode.status === "published" ? "success" : "muted"}>
                    {episode.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-faint">
                  {episode.status === "published"
                    ? `Published ${formatDate(episode.publishedAt)}`
                    : `Last updated ${formatDate(episode.updatedAt)}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/episodes/${episode.id}`}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteEpisode.bind(null, episode.id)}
                  confirmMessage={`Delete "${episode.title}"? This can't be undone.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
