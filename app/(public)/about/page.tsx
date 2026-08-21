import { BookOpen, Heart, Mic } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About",
  description: "The heart behind Grace Teaches.",
};

const values = [
  {
    icon: BookOpen,
    title: "Scripture first",
    body: "Every post and episode starts in the text, not in a trend. We want to help you read the Bible for yourself, not just take our word for it.",
  },
  {
    icon: Heart,
    title: "Grace over performance",
    body: "Faith isn't about having it all together. We talk honestly about doubt, growth, and what it actually looks like to follow Jesus in ordinary life.",
  },
  {
    icon: Mic,
    title: "Made to be shared",
    body: "Read on your own or listen on a drive. Everything we make is meant to be passed along to a friend who needs it.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Why Grace Teaches exists
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Grace Teaches started as a handful of notes shared after church on Sunday mornings. It
          grew into a blog and podcast for one simple reason: Scripture is meant to be lived, not
          just studied — and it helps to walk through it together.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Whether you&apos;ve followed Jesus for decades or you&apos;re just starting to ask honest
          questions, you&apos;re welcome here.
        </p>
      </header>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="card p-6">
            <value.icon className="h-6 w-6 text-rust" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-lg font-semibold text-ink">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{value.body}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
