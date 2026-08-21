import type { Metadata } from "next";
import { EpisodeCard } from "@/components/site/episode-card";
import { Container } from "@/components/ui/container";
import { getPublishedEpisodes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Listen to the Grace Teaches podcast — conversations rooted in Scripture.",
};

export default async function PodcastIndexPage() {
  const episodes = await getPublishedEpisodes();

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The Podcast</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Conversations rooted in Scripture
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Unhurried conversations about faith, Scripture, and what it looks like to actually live it
          out.
        </p>
      </header>

      {episodes.length === 0 ? (
        <p className="mt-16 text-ink-soft">No episodes published yet — check back soon.</p>
      ) : (
        <div className="mt-14 grid gap-4">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </Container>
  );
}
