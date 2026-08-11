import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EpisodeForm } from "@/components/admin/episode-form";
import { createEpisode } from "@/lib/actions/episodes";

export const metadata: Metadata = { title: "New Episode", robots: { index: false } };

export default function NewEpisodePage() {
  return (
    <div>
      <Link
        href="/admin/episodes"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to episodes
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">New episode</h1>
      <div className="mt-8 max-w-3xl">
        <EpisodeForm action={createEpisode} />
      </div>
    </div>
  );
}
