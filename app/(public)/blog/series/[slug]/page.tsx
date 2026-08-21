import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/site/post-card";
import { Container } from "@/components/ui/container";
import { getPublishedSeriesPosts, getSeriesBySlug } from "@/lib/content";

export async function generateMetadata(props: PageProps<"/blog/series/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const seriesEntry = await getSeriesBySlug(slug);
  if (!seriesEntry) return {};

  return {
    title: `${seriesEntry.title} — Series`,
    description: seriesEntry.description ?? undefined,
    openGraph: {
      title: seriesEntry.title,
      description: seriesEntry.description ?? undefined,
      images: seriesEntry.coverImageUrl ? [seriesEntry.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogSeriesPage(props: PageProps<"/blog/series/[slug]">) {
  const { slug } = await props.params;
  const seriesEntry = await getSeriesBySlug(slug);

  if (!seriesEntry) notFound();

  const seriesPosts = await getPublishedSeriesPosts(seriesEntry.id);

  return (
    <Container className="py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
      </Link>

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Series</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {seriesEntry.title}
        </h1>
        {seriesEntry.description ? (
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{seriesEntry.description}</p>
        ) : null}
        {seriesPosts.length > 0 ? (
          <p className="mt-3 text-sm text-ink-faint">
            {seriesPosts.length} {seriesPosts.length === 1 ? "part" : "parts"}
          </p>
        ) : null}
      </header>

      {seriesEntry.coverImageUrl ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-paper-deep">
          <Image
            src={seriesEntry.coverImageUrl}
            alt={seriesEntry.title}
            fill
            className="object-cover"
          />
        </div>
      ) : null}

      {seriesPosts.length === 0 ? (
        <p className="mt-16 text-ink-soft">No posts published in this series yet.</p>
      ) : (
        <ol className="mt-14 space-y-6">
          {seriesPosts.map((post, index) => (
            <li key={post.id} className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="font-display text-3xl italic text-gold-soft sm:w-16 sm:shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <PostCard post={post} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
}
