"use client";

import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type RippleProps = {
  children: ReactNode;
  className?: string;
  color?: "white" | "emerald";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  as?: "button" | "div";
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Ripple({
  children,
  className = "",
  color = "white",
  onClick,
  as = "button",
  type = "button",
  disabled,
}: RippleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useMotion();

  const spawn = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (reducedMotion || !ref.current) {
        onClick?.(e);
        return;
      }
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;
        border-radius:9999px;pointer-events:none;
        background:${color === "emerald" ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.12)"};
        transform:scale(0);opacity:1;
      `;
      el.appendChild(ripple);
      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
      onClick?.(e);
    },
    [color, onClick, reducedMotion]
  );

  const shared = {
    ref: ref as never,
    className: `relative overflow-hidden ${className}`,
    onClick: spawn,
  };

  if (as === "div") {
    return <div {...shared}>{children}</div>;
  }

  return (
    <button type={type} disabled={disabled} {...shared}>
      {children}
    </button>
  );
}
