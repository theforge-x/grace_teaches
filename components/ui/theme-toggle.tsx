"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";
import { cn } from "@/lib/utils";

function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle({ className }: { className?: string }) {
  useLayoutEffect(() => {
    // React clears attributes it doesn't manage on dev Strict Mode remounts;
    // re-apply the stored theme. No-op in production.
    try {
      const stored = localStorage.getItem("theme");
      const preferred =
        stored === "dark" || stored === "light"
          ? stored
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
      applyTheme(preferred);
    } catch {}
  }, []);

  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-rust/50 hover:text-rust",
        className,
      )}
    >
      <Sun className="h-4 w-4 dark:hidden" strokeWidth={1.75} />
      <Moon className="hidden h-4 w-4 dark:block" strokeWidth={1.75} />
    </button>
  );
}
