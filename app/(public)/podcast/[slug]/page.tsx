import { ArrowLeft, Mic } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getPublishedEpisodeBySlug, getPublishedEpisodes } from "@/lib/content";
import { formatDate, formatDuration } from "@/lib/utils";

export async function generateStaticParams() {
  const episodes = await getPublishedEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata(props: PageProps<"/podcast/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const episode = await getPublishedEpisodeBySlug(slug);
  if (!episode) return {};

  return {
    title: episode.title,
    description: episode.description ?? undefined,
  };
}

export default async function EpisodePage(props: PageProps<"/podcast/[slug]">) {
  const { slug } = await props.params;
  const episode = await getPublishedEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/podcast"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to podcast
        </Link>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-paper-deep sm:w-48">
            {episode.coverImageUrl ? (
              <Image
                src={episode.coverImageUrl}
                alt={episode.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Mic className="h-10 w-10 text-gold" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium uppercase tracking-widest text-gold">
              Season {episode.season} · Episode {episode.episodeNumber ?? "—"}
            </p>
            {episode.scripture ? (
              <p className="mt-1 text-sm text-ink-faint">{episode.scripture}</p>
            ) : null}
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {episode.title}
            </h1>
            <p className="mt-3 text-sm text-ink-faint">
              {formatDate(episode.publishedAt)}
              {episode.durationSeconds ? ` · ${formatDuration(episode.durationSeconds)}` : ""}
            </p>

            {/* biome-ignore lint/a11y/useMediaCaption: podcast audio has no synced captions track; the description above serves as a text alternative */}
            <audio controls className="mt-6 w-full" preload="none">
              <source src={episode.audioUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        {episode.description ? (
          <div className="prose-grace mt-12 max-w-none">
            <p>{episode.description}</p>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
