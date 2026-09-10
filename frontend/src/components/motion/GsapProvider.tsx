"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MotionContextValue = {
  reducedMotion: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
});

export function useMotion() {
  return useContext(MotionContext);
}

export function GsapProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const value = useMemo(() => ({ reducedMotion }), [reducedMotion]);

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}
