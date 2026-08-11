import Link from "next/link";
import { Wordmark } from "@/components/site/wordmark";
import { Container } from "@/components/ui/container";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line/70">
      <Container className="flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-rust"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
