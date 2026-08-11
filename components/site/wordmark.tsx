import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-2 font-display", className)}>
      <span className="text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-rust">
        Grace
      </span>
      <span className="relative text-2xl font-semibold italic tracking-tight text-rust">
        Teaches
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
