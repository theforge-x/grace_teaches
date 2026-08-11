import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { createPost } from "@/lib/actions/posts";

export const metadata: Metadata = { title: "New Post", robots: { index: false } };

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to posts
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">New post</h1>
      <div className="mt-8 max-w-3xl">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
