import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "./index";
import { episodes, posts, series, user } from "./schema";

async function main() {
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before seeding.",
    );
  }

  const existing = await db.query.user.findFirst({ where: eq(user.email, email) });

  let adminId: string;

  if (existing) {
    console.log(`Admin user ${email} already exists, skipping creation.`);
    adminId = existing.id;
  } else {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    adminId = result.user.id;
    console.log(`Created admin user ${email}.`);
  }

  await db.update(user).set({ role: "admin" }).where(eq(user.id, adminId));
  console.log(`Set role=admin for ${email}.`);

  let seriesId: string | null = null;
  const existingSeries = await db.query.series.findFirst({
    where: eq(series.slug, "foundations-of-faith"),
  });

  if (existingSeries) {
    seriesId = existingSeries.id;
  } else {
    const inserted = await db
      .insert(series)
      .values({
        title: "Foundations of Faith",
        slug: "foundations-of-faith",
        description:
          "A short series on the essentials of trusting God — what faith is, how it grows, and how it changes the way we live.",
      })
      .returning({ id: series.id });
    seriesId = inserted[0].id;
    console.log("Seeded a sample series.");
  }

  const existingPost = await db.query.posts.findFirst();
  if (!existingPost) {
    await db.insert(posts).values([
      {
        title: "Walking by Faith, Not by Sight",
        slug: "walking-by-faith-not-by-sight",
        excerpt:
          "What it really means to trust God when the road ahead is unclear, and how Scripture equips us for the walk.",
        content: `# Walking by Faith, Not by Sight

"For we walk by faith, not by sight." — 2 Corinthians 5:7

There are seasons when the path ahead feels completely hidden. This is not a flaw in your faith — it is the very place faith is designed for.

## Trusting the Unseen

Faith does not require the absence of uncertainty. It requires the presence of trust. Abraham left his home "not knowing where he was going" (Hebrews 11:8), and it was counted to him as righteousness.

## A Practical Next Step

This week, name one situation where you're tempted to lead with sight instead of faith. Bring it to God in prayer and ask Him to grow your trust in that specific place.`,
        scripture: "2 Corinthians 5:7",
        status: "published",
        publishedAt: new Date(),
        authorId: adminId,
        seriesId,
        seriesOrder: 1,
      },
      {
        title: "How Faith Grows in the Waiting",
        slug: "how-faith-grows-in-the-waiting",
        excerpt:
          "The seasons where nothing seems to happen are often the seasons where faith is quietly taking root.",
        content: `# How Faith Grows in the Waiting

"Wait for the LORD; be strong, and let your heart take courage." — Psalm 27:14

Waiting is not wasted time. Between the promise and its fulfilment, God is doing a deeper work in us than the one we asked for.

## The Hidden Work

David was anointed king years before he wore the crown. In the shepherd fields and the caves, God was building the man who could carry the throne.

## A Practical Next Step

Identify one prayer you've stopped praying because the answer felt slow. Pick it back up this week.`,
        scripture: "Psalm 27:14",
        status: "published",
        publishedAt: new Date(),
        authorId: adminId,
        seriesId,
        seriesOrder: 2,
      },
    ]);
    console.log("Seeded sample blog posts.");
  }

  const existingEpisode = await db.query.episodes.findFirst();
  if (!existingEpisode) {
    await db.insert(episodes).values({
      title: "Episode 1: Foundations of Grace",
      slug: "episode-1-foundations-of-grace",
      description:
        "We open the Grace Teaches podcast with a conversation about what grace actually means — and why it changes everything.",
      scripture: "Ephesians 2:8-9",
      audioUrl: "https://example.com/podcast/episode-1.mp3",
      season: 1,
      episodeNumber: 1,
      durationSeconds: 1800,
      status: "published",
      publishedAt: new Date(),
      authorId: adminId,
    });
    console.log("Seeded a sample podcast episode.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
