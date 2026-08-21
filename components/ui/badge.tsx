import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: "gold" | "rust" | "muted" | "success";
  className?: string;
}) {
  const tones = {
    gold: "bg-gold-bright/15 text-gold border-gold-bright/40",
    rust: "bg-rust/10 text-rust border-rust/30",
    muted: "bg-paper-deep text-ink-soft border-line",
    success: "bg-success/10 text-success border-success/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
