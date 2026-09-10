"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type NavLinkMotionProps = {
  href: string;
  label: string;
  active: boolean;
};

export function NavLinkMotion({ href, label, active }: NavLinkMotionProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const { reducedMotion } = useMotion();

  const onEnter = () => {
    if (reducedMotion) return;
    if (ref.current) {
      gsap.to(ref.current, {
        letterSpacing: "0.02em",
        duration: 0.25,
        ease: "power2.out",
      });
    }
    if (lineRef.current && !active) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0.5 },
        { scaleX: 1, opacity: 1, duration: 0.28, ease: "power3.out" }
      );
    }
  };

  const onLeave = () => {
    if (reducedMotion) return;
    if (ref.current) {
      gsap.to(ref.current, {
        letterSpacing: "0em",
        duration: 0.25,
        ease: "power2.out",
      });
    }
    if (lineRef.current && !active) {
      gsap.to(lineRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  return (
    <Link
      href={href}
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative pb-1 text-sm transition-colors ${
        active ? "text-ink" : "text-ink-secondary hover:text-ink"
      }`}
    >
      {label}
      <span
        ref={lineRef}
        className={`absolute inset-x-0 -bottom-[13px] h-px origin-left bg-emerald ${
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />
    </Link>
  );
}
