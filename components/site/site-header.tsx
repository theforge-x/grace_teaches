import Link from "next/link";
import { Wordmark } from "@/components/site/wordmark";
import { ContainerFluid } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/blog", label: "blog" },
  { href: "/podcast", label: "podcast" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-sm">
      <ContainerFluid className="flex items-center justify-between py-4">
        <Wordmark />
        <nav className="flex items-center gap-6 sm:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-rust"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </ContainerFluid>
    </header>
  );
}
