"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts, series, user } from "@/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const scripture = String(formData.get("scripture") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const authorId = String(formData.get("authorId") ?? "").trim();
  const seriesId = String(formData.get("seriesId") ?? "").trim();
  const seriesOrderRaw = String(formData.get("seriesOrder") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!title) {
    throw new Error("Title is required.");
  }
  if (!authorId) {
    throw new Error("Author is required.");
  }

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt: excerpt || null,
    content,
    scripture: scripture || null,
    coverImageUrl: coverImageUrl || null,
    authorId,
    seriesId: seriesId || null,
    seriesOrder: seriesOrderRaw ? Number(seriesOrderRaw) : null,
    status: status as "draft" | "published",
  };
}

async function assertAuthorAndSeriesExist(authorId: string, seriesId: string | null) {
  const author = await db.query.user.findFirst({ where: eq(user.id, authorId) });
  if (!author) throw new Error("Selected author does not exist.");

  if (seriesId) {
    const existingSeries = await db.query.series.findFirst({ where: eq(series.id, seriesId) });
    if (!existingSeries) throw new Error("Selected series does not exist.");
  }
}

export async function createPost(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readPostFields(formData);
  await assertAuthorAndSeriesExist(fields.authorId, fields.seriesId);

  await db.insert(posts).values({
    ...fields,
    publishedAt: fields.status === "published" ? new Date() : null,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readPostFields(formData);
  await assertAuthorAndSeriesExist(fields.authorId, fields.seriesId);

  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!existing) throw new Error("Post not found.");

  const wasPublished = existing.status === "published";
  const willBePublished = fields.status === "published";

  await db
    .update(posts)
    .set({
      ...fields,
      updatedAt: new Date(),
      publishedAt: !wasPublished && willBePublished ? new Date() : existing.publishedAt,
    })
    .where(eq(posts.id, id));

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  if (fields.slug !== existing.slug) revalidatePath(`/blog/${fields.slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);
  revalidatePath("/admin/posts");
}
