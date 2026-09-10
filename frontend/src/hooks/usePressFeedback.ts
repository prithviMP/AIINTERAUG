"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function usePressFeedback() {
  const reduced = usePrefersReducedMotion();
  const elRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    elRef.current = node;
  }, []);

  const onPress = useCallback(() => {
    if (!elRef.current || reduced) return;
    gsap.to(elRef.current, {
      scale: 0.97,
      duration: 0.12,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [reduced]);

  const onRelease = useCallback(() => {
    if (!elRef.current || reduced) return;
    gsap
      .timeline({ overwrite: "auto" })
      .to(elRef.current, { scale: 1.02, duration: 0.12, ease: "power2.out" })
      .to(elRef.current, { scale: 1, duration: 0.16, ease: "power3.out" });
  }, [reduced]);

  return { setRef, onPress, onRelease, reduced };
}
