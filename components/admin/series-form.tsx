"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { series } from "@/db/schema";

type Series = typeof series.$inferSelect;

export function SeriesForm({
  series,
  action,
}: {
  series?: Series;
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
            defaultValue={series?.title}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="The Sermon on the Mount"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-ink">
            Slug <span className="text-ink-faint">(optional — generated from title)</span>
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={series?.slug}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="the-sermon-on-the-mount"
          />
        </div>

        <div>
          <label htmlFor="coverImageUrl" className="mb-1.5 block text-sm font-medium text-ink">
            Cover image URL <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={series?.coverImageUrl ?? ""}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
            placeholder="https://…"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
            Description <span className="text-ink-faint">(shown on the series page)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={series?.description ?? ""}
            className="w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rust"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : series ? "Save changes" : "Create series"}
        </Button>
      </div>
    </form>
  );
}
