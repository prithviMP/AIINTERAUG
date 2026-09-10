"use client";

import Link from "next/link";
import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  strength?: number;
  type?: "button" | "submit";
};

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  disabled,
  strength = 8,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useMotion();

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: (dx / rect.width) * strength,
      y: (dy / rect.height) * strength,
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onDown = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { scale: 0.97, duration: 0.1, ease: "power2.out" });
  };

  const onUp = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { scale: 1, duration: 0.2, ease: "power3.out" });
  };

  const sharedClass = `inline-flex will-change-transform ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as never}
        className={sharedClass}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      ref={ref as never}
      className={sharedClass}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
