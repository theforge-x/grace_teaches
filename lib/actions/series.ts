"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { series } from "@/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";

function readSeriesFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();

  if (!title) throw new Error("Title is required.");

  return {
    title,
    slug: slugify(slugInput || title),
    description: description || null,
    coverImageUrl: coverImageUrl || null,
  };
}

export async function createSeries(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  await db.insert(series).values(readSeriesFields(formData));

  revalidatePath("/blog");
  revalidatePath("/admin/series");
  redirect("/admin/series");
}

export async function updateSeries(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readSeriesFields(formData);

  const existing = await db.query.series.findFirst({ where: eq(series.id, id) });
  if (!existing) throw new Error("Series not found.");

  await db
    .update(series)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(series.id, id));

  revalidatePath("/blog");
  revalidatePath(`/blog/series/${existing.slug}`);
  if (fields.slug !== existing.slug) revalidatePath(`/blog/series/${fields.slug}`);
  revalidatePath("/admin/series");
  redirect("/admin/series");
}

export async function deleteSeries(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const existing = await db.query.series.findFirst({ where: eq(series.id, id) });
  await db.delete(series).where(eq(series.id, id));

  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/series/${existing.slug}`);
  revalidatePath("/admin/series");
}
