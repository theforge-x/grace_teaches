import { ArrowRight, BookOpen, Mic } from "lucide-react";
import { EpisodeCard } from "@/components/site/episode-card";
import { PostCard } from "@/components/site/post-card";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getLatestPublished } from "@/lib/content";

export default async function HomePage() {
  const { latestPosts, latestEpisodes } = await getLatestPublished(3);

  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Container className="animate-rise">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gold">
            <span className="h-px w-8 bg-gold" /> Bible teaching, unhurried
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Faith that holds up on an <span className="italic text-rust">ordinary</span> Tuesday.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Grace Teaches is a blog and podcast for people who want to know Scripture more deeply
            and live it more honestly — no jargon, no performance, just grace for the walk.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton href="/blog" size="md">
              Read the blog <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/podcast" variant="secondary" size="md">
              Listen to the podcast
            </LinkButton>
          </div>
        </Container>
      </section>

      {latestPosts.length > 0 ? (
        <section className="py-16">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
                  <BookOpen className="h-3.5 w-3.5" /> From the blog
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                  Recent teaching
                </h2>
              </div>
              <LinkButton href="/blog" variant="ghost" size="sm">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </LinkButton>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, i) => (
                <PostCard key={post.id} post={post} featured={i === 0} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {latestEpisodes.length > 0 ? (
        <section className="border-t border-line/70 bg-paper-raised/40 py-16">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
                  <Mic className="h-3.5 w-3.5" /> From the podcast
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                  Latest episodes
                </h2>
              </div>
              <LinkButton href="/podcast" variant="ghost" size="sm">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </LinkButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestEpisodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
