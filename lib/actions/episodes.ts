"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";

function readEpisodeFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const scripture = String(formData.get("scripture") ?? "").trim();
  const audioUrl = String(formData.get("audioUrl") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const season = Number(formData.get("season") ?? 1) || 1;
  const episodeNumberRaw = String(formData.get("episodeNumber") ?? "").trim();
  const durationRaw = String(formData.get("durationSeconds") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!title) throw new Error("Title is required.");
  if (!audioUrl) throw new Error("Audio URL is required.");

  return {
    title,
    slug: slugify(slugInput || title),
    description: description || null,
    scripture: scripture || null,
    audioUrl,
    coverImageUrl: coverImageUrl || null,
    season,
    episodeNumber: episodeNumberRaw ? Number(episodeNumberRaw) : null,
    durationSeconds: durationRaw ? Number(durationRaw) : null,
    status: status as "draft" | "published",
  };
}

export async function createEpisode(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readEpisodeFields(formData);

  await db.insert(episodes).values({
    ...fields,
    authorId: session.user.id,
    publishedAt: fields.status === "published" ? new Date() : null,
  });

  revalidatePath("/podcast");
  revalidatePath("/admin/episodes");
  redirect("/admin/episodes");
}

export async function updateEpisode(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readEpisodeFields(formData);

  const existing = await db.query.episodes.findFirst({ where: eq(episodes.id, id) });
  if (!existing) throw new Error("Episode not found.");

  const wasPublished = existing.status === "published";
  const willBePublished = fields.status === "published";

  await db
    .update(episodes)
    .set({
      ...fields,
      updatedAt: new Date(),
      publishedAt: !wasPublished && willBePublished ? new Date() : existing.publishedAt,
    })
    .where(eq(episodes.id, id));

  revalidatePath("/podcast");
  revalidatePath(`/podcast/${existing.slug}`);
  if (fields.slug !== existing.slug) revalidatePath(`/podcast/${fields.slug}`);
  revalidatePath("/admin/episodes");
  redirect("/admin/episodes");
}

export async function deleteEpisode(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const existing = await db.query.episodes.findFirst({ where: eq(episodes.id, id) });
  await db.delete(episodes).where(eq(episodes.id, id));

  revalidatePath("/podcast");
  if (existing) revalidatePath(`/podcast/${existing.slug}`);
  revalidatePath("/admin/episodes");
}
