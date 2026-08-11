import { desc } from "drizzle-orm";
import { PenSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { deletePost } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog Posts", robots: { index: false } };

export default async function AdminPostsPage() {
  const allPosts = await db.query.posts.findMany({ orderBy: [desc(posts.createdAt)] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Blog Posts</h1>
          <p className="mt-1 text-sm text-ink-soft">{allPosts.length} total</p>
        </div>
        <LinkButton href="/admin/posts/new" size="sm">
          <PenSquare className="h-3.5 w-3.5" /> New post
        </LinkButton>
      </div>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper-raised/40">
        {allPosts.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No posts yet. Create your first one.
          </p>
        ) : (
          allPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="truncate font-medium text-ink hover:text-rust"
                  >
                    {post.title}
                  </Link>
                  <Badge tone={post.status === "published" ? "success" : "muted"}>
                    {post.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-faint">
                  {post.status === "published"
                    ? `Published ${formatDate(post.publishedAt)}`
                    : `Last updated ${formatDate(post.updatedAt)}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deletePost.bind(null, post.id)}
                  confirmMessage={`Delete "${post.title}"? This can't be undone.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
