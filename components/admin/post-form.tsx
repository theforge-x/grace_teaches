"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { posts } from "@/db/schema";

type Post = typeof posts.$inferSelect;

type AuthorOption = { id: string; name: string };
type SeriesOption = { id: string; title: string };

export function PostForm({
  post,
  action,
  authors,
  seriesOptions = [],
}: {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
  authors: AuthorOption[];
  seriesOptions?: SeriesOption[];
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
          <label htmlFor="title" className="field-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            className="field-input"
            placeholder="Walking by Faith, Not by Sight"
          />
        </div>

        <div>
          <label htmlFor="slug" className="field-label">
            Slug <span className="text-ink-faint">(optional — generated from title)</span>
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            className="field-input"
            placeholder="walking-by-faith-not-by-sight"
          />
        </div>

        <div>
          <label htmlFor="authorId" className="field-label">
            Author
          </label>
          <select
            id="authorId"
            name="authorId"
            required
            defaultValue={post?.authorId ?? ""}
            className="field-input"
          >
            <option value="" disabled>
              Select an author…
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="scripture" className="field-label">
            Scripture reference <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="scripture"
            name="scripture"
            defaultValue={post?.scripture ?? ""}
            className="field-input"
            placeholder="2 Corinthians 5:7"
          />
        </div>

        <div>
          <label htmlFor="seriesId" className="field-label">
            Series <span className="text-ink-faint">(optional)</span>
          </label>
          <select
            id="seriesId"
            name="seriesId"
            defaultValue={post?.seriesId ?? ""}
            className="field-input"
          >
            <option value="">None</option>
            {seriesOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="seriesOrder" className="field-label">
            Part number in series <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="seriesOrder"
            name="seriesOrder"
            type="number"
            min={1}
            defaultValue={post?.seriesOrder ?? ""}
            className="field-input"
            placeholder="1"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className="field-label">
            Excerpt <span className="text-ink-faint">(shown on cards & previews)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt ?? ""}
            className="field-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="coverImageUrl" className="field-label">
            Cover image URL <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={post?.coverImageUrl ?? ""}
            className="field-input"
            placeholder="https://…"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="content" className="field-label">
            Content <span className="text-ink-faint">(Markdown supported)</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={16}
            required
            defaultValue={post?.content}
            className="field-input font-mono"
          />
        </div>

        <div>
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="field-input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-field bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
