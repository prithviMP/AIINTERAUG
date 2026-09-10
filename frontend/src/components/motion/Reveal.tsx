"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/motion/GsapProvider";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!ref.current) return;
    if (reducedMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, reducedMotion, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: reducedMotion ? 1 : 0 }}>
      {children}
    </div>
  );
}
