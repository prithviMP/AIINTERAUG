"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/motion/GsapProvider";

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function ParallaxLayer({
  children,
  className = "",
  speed = 40,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!ref.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: -speed * 0.25 },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [reducedMotion, speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
