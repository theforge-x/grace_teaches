import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SeriesForm } from "@/components/admin/series-form";
import { createSeries } from "@/lib/actions/series";

export const metadata: Metadata = { title: "New Series", robots: { index: false } };

export default function NewSeriesPage() {
  return (
    <div>
      <Link
        href="/admin/series"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to series
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">New series</h1>
      <div className="mt-8 max-w-3xl">
        <SeriesForm action={createSeries} />
      </div>
    </div>
  );
}
