import { asc, count, eq } from "drizzle-orm";
import { Library } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { deleteSeries } from "@/lib/actions/series";

export const metadata: Metadata = { title: "Series", robots: { index: false } };

export default async function AdminSeriesPage() {
  const allSeries = await db
    .select({
      id: series.id,
      title: series.title,
      slug: series.slug,
      description: series.description,
      postCount: count(posts.id),
    })
    .from(series)
    .leftJoin(posts, eq(posts.seriesId, series.id))
    .groupBy(series.id)
    .orderBy(asc(series.title));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Series</h1>
          <p className="mt-1 text-sm text-ink-soft">{allSeries.length} total</p>
        </div>
        <LinkButton href="/admin/series/new" size="sm">
          <Library className="h-3.5 w-3.5" /> New series
        </LinkButton>
      </div>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper-raised/40">
        {allSeries.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No series yet. Create your first one.
          </p>
        ) : (
          allSeries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <Link
                  href={`/admin/series/${entry.id}`}
                  className="truncate font-medium text-ink hover:text-rust"
                >
                  {entry.title}
                </Link>
                <p className="mt-1 text-xs text-ink-faint">
                  {entry.postCount} {entry.postCount === 1 ? "post" : "posts"}
                  {entry.description ? ` — ${entry.description}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/series/${entry.id}`}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteSeries.bind(null, entry.id)}
                  confirmMessage={`Delete "${entry.title}"? Posts will remain but no longer belong to a series.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
