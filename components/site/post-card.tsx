import Image from "next/image";
import Link from "next/link";
import type { getPublishedPosts } from "@/lib/content";
import { excerptFrom, formatDate } from "@/lib/utils";

export type PostCardData = Awaited<ReturnType<typeof getPublishedPosts>>[number];

export function PostCard({ post, featured = false }: { post: PostCardData; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-rust/40 hover:shadow-lift"
    >
      <div
        className={`relative overflow-hidden bg-paper-deep ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl italic text-gold-bright">GT</span>
          </div>
        )}
      </div>
      <div className="p-6">
        {post.series ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-rust">
            {post.series.title}
            {post.seriesOrder ? ` · Part ${post.seriesOrder}` : ""}
          </p>
        ) : null}
        {post.scripture ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gold">
            {post.scripture}
          </p>
        ) : null}
        <h3
          className={`font-display font-semibold text-ink group-hover:text-rust ${featured ? "text-2xl" : "text-lg"}`}
        >
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {post.excerpt || excerptFrom(post.content)}
        </p>
        <p className="mt-4 text-xs text-ink-faint">
          {post.author?.name ? `${post.author.name} · ` : ""}
          {formatDate(post.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
