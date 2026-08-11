import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { updatePost } from "@/lib/actions/posts";

export const metadata: Metadata = { title: "Edit Post", robots: { index: false } };

export default async function EditPostPage(props: PageProps<"/admin/posts/[id]">) {
  const { id } = await props.params;
  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });

  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, post.id);

  return (
    <div>
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to posts
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Edit post</h1>
      <div className="mt-8 max-w-3xl">
        <PostForm post={post} action={boundUpdate} />
      </div>
    </div>
  );
}
