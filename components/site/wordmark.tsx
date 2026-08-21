import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group text-2xl inline-flex items-baseline font-display", className)}
    >
      <span className="italic tracking-tight text-ink transition-colors group-hover:text-rust">
        grace
      </span>
      <span className="relative font-body font-semibold tracking-tight text-rust">
        teaches
        <svg
          className="absolute -bottom-1 left-0 w-full text-gold-soft"
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 4 Q 50 -1 100 4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </span>
    </Link>
  );
}
