"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/setup", label: "Setup Engine" },
  { href: "/interview", label: "Live Session" },
  { href: "/results", label: "Scorecard" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-console flex min-h-screen flex-col text-ink">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-tight text-emerald">
              {"///"}
            </span>
            <span className="font-sans text-sm font-semibold tracking-tight">
              COACH.AI
            </span>
            <span className="label-caps rounded-full border border-surface-high bg-surface px-2 py-0.5 text-ink-muted">
              PRO V2.4
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative pb-1 text-sm transition-colors ${
                    active
                      ? "text-ink"
                      : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-[13px] h-px bg-emerald" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="label-caps flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface px-3 py-1.5 text-ink-secondary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              SYSTEM ONLINE
            </div>
            <div
              className="h-8 w-8 rounded-full border border-surface-high bg-surface-raised"
              aria-hidden
            />
          </div>
        </div>

        <nav className="flex gap-4 overflow-x-auto border-t border-white/[0.06] px-4 py-2 md:hidden">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`label-caps whitespace-nowrap ${
                  active ? "text-emerald" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6 lg:px-12 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-white/[0.08] bg-canvas">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-[11px] text-ink-muted md:flex-row md:items-center md:justify-between md:px-6 lg:px-12">
          <span className="font-mono uppercase tracking-wider">
            COACH.AI {"//"} RUNTIME RUNIC_64 TELEMETRY ACTIVE
          </span>
          <span>© 2025 COACH.AI Engineering Core. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
