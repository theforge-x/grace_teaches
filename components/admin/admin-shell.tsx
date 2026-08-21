"use client";

import { LayoutDashboard, Library, LogOut, Mic, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/series", label: "Series", icon: Library },
  { href: "/admin/episodes", label: "Podcast Episodes", icon: Mic },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-paper-raised/50">
        <div className="border-b border-line px-6 py-6">
          <Link href="/" className="font-display italic text-xl text-ink">
            grace<span className="font-body font-semibold text-rust">teaches</span>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-rust/10 text-rust"
                    : "text-ink-soft hover:bg-paper-deep hover:text-ink",
                )}
              >
                <link.icon className="h-4 w-4" strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line px-4 py-4">
          <div className="flex items-center justify-between px-2">
            <p className="truncate text-xs text-ink-faint">Signed in as {userName}</p>
            <ThemeToggle className="h-8 w-8" />
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
