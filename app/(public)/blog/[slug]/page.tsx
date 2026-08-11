import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/container";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/content";
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

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
        </Link>

        <header className="mt-8">
          {post.scripture ? (
            <p className="text-sm font-medium uppercase tracking-widest text-gold">
              {post.scripture}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-ink-faint">{formatDate(post.publishedAt)}</p>
        </header>

        {post.coverImageUrl ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-paper-deep">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}

        <div className="prose-grace mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </Container>
    </article>
  );
}
