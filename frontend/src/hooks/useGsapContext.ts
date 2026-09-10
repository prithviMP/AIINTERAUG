"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  deps: unknown[] = []
) {
  const scope = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      setup(ctx);
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
