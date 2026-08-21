import { ArrowLeft, ArrowRight, Library } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/container";
import {
  getPublishedPostBySlug,
  getPublishedPosts,
  getPublishedSeriesPosts,
  getSeriesNeighbours,
} from "@/lib/content";
import { excerptFrom, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const description = post.excerpt || excerptFrom(post.content);
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { previous, next } = await getSeriesNeighbours(post);
  const partNumber = post.series ? await getSeriesPosition(post.series.id, post.id) : null;

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
        </Link>

        {post.series ? (
          <div className="card mt-8 px-5 py-4">
            <Link
              href={`/blog/series/${post.series.slug}`}
              className="flex items-center gap-2 text-sm font-medium text-rust hover:text-rust-strong"
            >
              <Library className="h-4 w-4" strokeWidth={1.75} />
              {partNumber
                ? `Part ${partNumber} of the series “${post.series.title}”`
                : `From the series “${post.series.title}”`}
            </Link>
          </div>
        ) : null}

        <header className="mt-8">
          {post.scripture ? (
            <p className="text-sm font-medium uppercase tracking-widest text-gold">
              {post.scripture}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-ink-faint">
            {post.author?.name ? `${post.author.name} · ` : ""}
            {formatDate(post.publishedAt)}
          </p>
        </header>

        {post.coverImageUrl ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-paper-deep">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}

        <div className="prose-grace mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {previous || next ? (
          <nav className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="card group p-5 transition-colors hover:border-rust/40 hover:shadow-lift"
              >
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  <ArrowLeft className="h-3 w-3" /> Previous in series
                </p>
                <p className="mt-2 font-display font-semibold text-ink group-hover:text-rust">
                  {previous.title}
                </p>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="card group p-5 text-right transition-colors hover:border-rust/40 hover:shadow-lift"
              >
                <p className="flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Next in series <ArrowRight className="h-3 w-3" />
                </p>
                <p className="mt-2 font-display font-semibold text-ink group-hover:text-rust">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Container>
    </article>
  );
}

async function getSeriesPosition(seriesId: string, postId: string) {
  const siblings = await getPublishedSeriesPosts(seriesId);
  const index = siblings.findIndex((sibling) => sibling.id === postId);
  return index >= 0 ? index + 1 : null;
}
