"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: () => void;
};

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  onClick,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -maxTilt;
    const ry = (px - 0.5) * maxTilt;
    gsap.to(ref.current, {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 900,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.12), transparent 55%)`,
        duration: 0.2,
        overwrite: "auto",
      });
    }
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.3 });
    }
  };

  const onEnter = () => {
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 1, duration: 0.2 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      onClick={onClick}
      className={`relative transform-gpu will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
        aria-hidden
      />
    </div>
  );
}
