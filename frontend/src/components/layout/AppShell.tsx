"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { NavLinkMotion } from "@/components/motion/NavLinkMotion";
import { useMotion } from "@/components/motion/GsapProvider";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/setup", label: "Setup Engine" },
  { href: "/interview", label: "Live Session" },
  { href: "/results", label: "Scorecard" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const slashRef = useRef<HTMLSpanElement | null>(null);
  const statusRef = useRef<HTMLButtonElement | null>(null);
  const { reducedMotion } = useMotion();

  const onLogoClick = () => {
    if (reducedMotion) return;
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }
    if (slashRef.current) {
      gsap.fromTo(
        slashRef.current,
        { opacity: 0.3 },
        { opacity: 1, duration: 0.35, ease: "power2.out", yoyo: true, repeat: 1 }
      );
    }
  };

  const onStatusClick = () => {
    if (reducedMotion || !statusRef.current) return;
    gsap.fromTo(
      statusRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.25, ease: "power3.out" }
    );
  };

  return (
    <div className="bg-console flex min-h-screen flex-col text-ink">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-12">
          <Link
            href="/"
            ref={logoRef}
            onClick={onLogoClick}
            className="flex items-center gap-2 will-change-transform"
          >
            <span
              ref={slashRef}
              className="font-mono text-sm tracking-tight text-emerald"
            >
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
                <NavLinkMotion
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={active}
                />
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              ref={statusRef}
              onClick={onStatusClick}
              onMouseEnter={() => {
                if (!reducedMotion && statusRef.current) {
                  gsap.to(statusRef.current, {
                    boxShadow: "0 0 0 1px rgba(16,185,129,0.35)",
                    duration: 0.2,
                  });
                }
              }}
              onMouseLeave={() => {
                if (!reducedMotion && statusRef.current) {
                  gsap.to(statusRef.current, {
                    boxShadow: "0 0 0 0 rgba(16,185,129,0)",
                    duration: 0.2,
                  });
                }
              }}
              className="label-caps flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface px-3 py-1.5 text-ink-secondary will-change-transform"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              SYSTEM ONLINE
            </button>
            <div
              className="h-8 w-8 rounded-full border border-surface-high bg-surface-raised transition hover:border-emerald/40"
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
                className={`label-caps whitespace-nowrap transition ${
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
