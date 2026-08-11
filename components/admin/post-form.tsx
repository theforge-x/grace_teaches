"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { posts } from "@/db/schema";

type Post = typeof posts.$inferSelect;

export function PostForm({
  post,
  action,
}: {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        // Next.js throws a special error to perform redirects; let it propagate.
        if (err && typeof err === "object" && "digest" in err) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="Walking by Faith, Not by Sight"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-ink">
            Slug <span className="text-ink-faint">(optional — generated from title)</span>
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="walking-by-faith-not-by-sight"
          />
        </div>

        <div>
          <label htmlFor="scripture" className="mb-1.5 block text-sm font-medium text-ink">
            Scripture reference <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="scripture"
            name="scripture"
            defaultValue={post?.scripture ?? ""}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="2 Corinthians 5:7"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-ink">
            Excerpt <span className="text-ink-faint">(shown on cards & previews)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt ?? ""}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="coverImageUrl" className="mb-1.5 block text-sm font-medium text-ink">
            Cover image URL <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={post?.coverImageUrl ?? ""}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="https://…"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-ink">
            Content <span className="text-ink-faint">(Markdown supported)</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={16}
            required
            defaultValue={post?.content}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 font-mono text-sm text-ink outline-none focus:border-rust"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
