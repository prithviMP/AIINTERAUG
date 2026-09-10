"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  flashRing?: boolean;
  asChild?: boolean;
};

export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(
  function Pressable(
    { children, className = "", flashRing = false, onPointerDown, onPointerUp, onPointerLeave, onClick, ...rest },
    ref
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const { reducedMotion } = useMotion();

    const assignRef = useCallback(
      (node: HTMLButtonElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const press = () => {
      if (!localRef.current || reducedMotion) return;
      gsap.to(localRef.current, {
        scale: 0.97,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const release = () => {
      if (!localRef.current || reducedMotion) return;
      const tl = gsap.timeline({ overwrite: "auto" });
      tl.to(localRef.current, { scale: 1.02, duration: 0.1, ease: "power2.out" }).to(
        localRef.current,
        { scale: 1, duration: 0.16, ease: "power3.out" }
      );
      if (flashRing) {
        tl.fromTo(
          localRef.current,
          { boxShadow: "0 0 0 0 rgba(16,185,129,0.45)" },
          {
            boxShadow: "0 0 0 6px rgba(16,185,129,0)",
            duration: 0.35,
            ease: "power2.out",
          },
          0
        );
      }
    };

    return (
      <button
        ref={assignRef}
        className={`will-change-transform ${className}`}
        onPointerDown={(e) => {
          press();
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          release();
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          if (!reducedMotion && localRef.current) {
            gsap.to(localRef.current, { scale: 1, duration: 0.15, ease: "power2.out" });
          }
          onPointerLeave?.(e);
        }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
