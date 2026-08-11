import Link from "next/link";
import { Wordmark } from "@/components/site/wordmark";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line/70 bg-paper-raised/60">
      <Container className="flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Bible-based teaching for everyday faith — written and spoken, for anyone learning to
            walk with God one ordinary day at a time.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/blog" className="hover:text-rust">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-rust">
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rust">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
              Team
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/admin/login" className="hover:text-rust">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <Container className="border-t border-line/70 py-6">
        <p className="text-xs text-ink-faint">
          © {year} Grace Teaches. Scripture quotations are the writers&apos; own paraphrase unless
          noted.
        </p>
      </Container>
    </footer>
  );
}
