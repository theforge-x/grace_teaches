"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const scripture = String(formData.get("scripture") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!title) {
    throw new Error("Title is required.");
  }

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt: excerpt || null,
    content,
    scripture: scripture || null,
    coverImageUrl: coverImageUrl || null,
    status: status as "draft" | "published",
  };
}

export async function createPost(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Not authenticated.");

  const fields = readPostFields(formData);

  await db.insert(posts).values({
    ...fields,
    authorId: session.user.id,
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
