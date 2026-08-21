import type { Metadata } from "next";
import { PostCard } from "@/components/site/post-card";
import { Container } from "@/components/ui/container";
import { getPublishedPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bible-based teaching and reflection from Grace Teaches.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The Blog</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Teaching for the everyday
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Short studies, honest reflection, and Scripture applied to real life — written to be read
          slowly.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-ink-soft">No posts published yet — check back soon.</p>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
