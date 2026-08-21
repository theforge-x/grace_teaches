"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { episodes } from "@/db/schema";

type Episode = typeof episodes.$inferSelect;

export function EpisodeForm({
  episode,
  action,
}: {
  episode?: Episode;
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
            defaultValue={episode?.title}
            className="field-input"
            placeholder="Episode 1: Foundations of Grace"
          />
        </div>

        <div>
          <label htmlFor="slug" className="field-label">
            Slug <span className="text-ink-faint">(optional — generated from title)</span>
          </label>
          <input id="slug" name="slug" defaultValue={episode?.slug} className="field-input" />
        </div>

        <div>
          <label htmlFor="scripture" className="field-label">
            Scripture reference <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="scripture"
            name="scripture"
            defaultValue={episode?.scripture ?? ""}
            className="field-input"
            placeholder="Ephesians 2:8-9"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 sm:col-span-2">
          <div>
            <label htmlFor="season" className="field-label">
              Season
            </label>
            <input
              id="season"
              name="season"
              type="number"
              min={1}
              defaultValue={episode?.season ?? 1}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="episodeNumber" className="field-label">
              Episode #
            </label>
            <input
              id="episodeNumber"
              name="episodeNumber"
              type="number"
              min={1}
              defaultValue={episode?.episodeNumber ?? ""}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="durationSeconds" className="field-label">
              Duration <span className="text-ink-faint">(sec)</span>
            </label>
            <input
              id="durationSeconds"
              name="durationSeconds"
              type="number"
              min={0}
              defaultValue={episode?.durationSeconds ?? ""}
              className="field-input"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="audioUrl" className="field-label">
            Audio URL
          </label>
          <input
            id="audioUrl"
            name="audioUrl"
            required
            defaultValue={episode?.audioUrl}
            className="field-input"
            placeholder="https://…/episode-1.mp3"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="coverImageUrl" className="field-label">
            Cover image URL <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={episode?.coverImageUrl ?? ""}
            className="field-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="field-label">
            Description / show notes
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={episode?.description ?? ""}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={episode?.status ?? "draft"}
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
          {isPending ? "Saving…" : episode ? "Save changes" : "Create episode"}
        </Button>
      </div>
    </form>
  );
}
