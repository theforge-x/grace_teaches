import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeForm } from "@/components/admin/episode-form";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { updateEpisode } from "@/lib/actions/episodes";

export const metadata: Metadata = { title: "Edit Episode", robots: { index: false } };

export default async function EditEpisodePage(props: PageProps<"/admin/episodes/[id]">) {
  const { id } = await props.params;
  const episode = await db.query.episodes.findFirst({ where: eq(episodes.id, id) });

  if (!episode) notFound();

  const boundUpdate = updateEpisode.bind(null, episode.id);

  return (
    <div>
      <Link
        href="/admin/episodes"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to episodes
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Edit episode</h1>
      <div className="mt-8 max-w-3xl">
        <EpisodeForm episode={episode} action={boundUpdate} />
      </div>
    </div>
  );
}
