import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { episodes } from "@/db/schema";
import { formatDate, formatDuration } from "@/lib/utils";

type Episode = typeof episodes.$inferSelect;

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link
      href={`/podcast/${episode.slug}`}
      className="card group flex gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rust/40 hover:shadow-lift"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper-deep">
        {episode.coverImageUrl ? (
          <Image src={episode.coverImageUrl} alt={episode.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play className="h-6 w-6 text-gold-bright" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
          <Play className="h-6 w-6 fill-white text-white" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-xs font-medium uppercase tracking-wide text-gold">
          Season {episode.season} · Episode {episode.episodeNumber ?? "—"}
        </p>
        <h3 className="mt-1 truncate font-display text-lg font-semibold text-ink group-hover:text-rust">
          {episode.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{episode.description}</p>
        <p className="mt-2 text-xs text-ink-faint">
          {formatDate(episode.publishedAt)}
          {episode.durationSeconds ? ` · ${formatDuration(episode.durationSeconds)}` : ""}
        </p>
      </div>
    </Link>
  );
}
