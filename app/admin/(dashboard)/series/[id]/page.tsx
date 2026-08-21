import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/delete-button";
import { SeriesForm } from "@/components/admin/series-form";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { deleteSeries, updateSeries } from "@/lib/actions/series";

export const metadata: Metadata = { title: "Edit Series", robots: { index: false } };

export default async function EditSeriesPage(props: PageProps<"/admin/series/[id]">) {
  const { id } = await props.params;
  const existing = await db.query.series.findFirst({ where: eq(series.id, id) });

  if (!existing) notFound();

  const seriesPosts = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(eq(posts.seriesId, id))
    .orderBy(asc(posts.seriesOrder));

  const boundUpdate = updateSeries.bind(null, existing.id);

  return (
    <div>
      <Link
        href="/admin/series"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to series
      </Link>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">Edit series</h1>
        <DeleteButton
          action={deleteSeries.bind(null, existing.id)}
          confirmMessage={`Delete "${existing.title}"? Posts will remain but no longer belong to a series.`}
        />
      </div>

      <div className="mt-8 max-w-3xl">
        <SeriesForm series={existing} action={boundUpdate} />

        {seriesPosts.length > 0 ? (
          <section className="mt-10 border-t border-line pt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint">
              Posts in this series
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-ink-soft">
              {seriesPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/posts/${post.id}`} className="hover:text-rust">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-faint">
              Set each post&rsquo;s part number from its edit page to control ordering.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
