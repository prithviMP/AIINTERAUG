"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotion } from "@/components/motion/GsapProvider";

type AiBusyOverlayProps = {
  open: boolean;
  mode: "generate" | "evaluate";
  topics?: string[];
  count?: number;
  difficulty?: string;
};

const GENERATE_STEPS = [
  "Calibrating topic vectors…",
  "Sampling L6/L7 rubric priors…",
  "Synthesizing adversarial MCQ stems…",
  "Validating option discriminability…",
  "Packaging question batch…",
];

const EVALUATE_STEPS = [
  "Replaying submission telemetry…",
  "Scoring objective accuracy…",
  "Mapping strengths vs deficit sectors…",
  "Composing staff-level synthesis…",
];

export function AiBusyOverlay({
  open,
  mode,
  topics = [],
  count,
  difficulty,
}: AiBusyOverlayProps) {
  const { reducedMotion } = useMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const steps = mode === "generate" ? GENERATE_STEPS : EVALUATE_STEPS;

  useEffect(() => {
    if (!open) {
      setStepIdx(0);
      return;
    }
    const id = window.setInterval(() => {
      setStepIdx((i) => (i + 1) % steps.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [open, steps.length]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.from("[data-busy-panel]", {
        y: 18,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      if (ringRef.current) {
        const circ = 2 * Math.PI * 54;
        gsap.set(ringRef.current, {
          strokeDasharray: circ,
          strokeDashoffset: circ * 0.25,
        });
        gsap.to(ringRef.current, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 1.4,
          repeat: -1,
          ease: "none",
        });
        gsap.to(ringRef.current, {
          strokeDashoffset: circ * 0.72,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }
      gsap.from("[data-busy-topic]", {
        opacity: 0,
        y: 8,
        stagger: 0.08,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.15,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-canvas/85 px-4 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        data-busy-panel
        className="panel-raised w-full max-w-md space-y-6 p-6 text-center"
      >
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#27272A"
              strokeWidth="4"
            />
            <circle
              ref={ringRef}
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute label-caps text-emerald">
            {mode === "generate" ? "GEN" : "EVAL"}
          </div>
        </div>

        <div>
          <p className="label-caps text-ink-muted">
            {mode === "generate"
              ? "GEMINI · MCQ SYNTHESIS"
              : "GEMINI · EVALUATION KERNEL"}
          </p>
          <h2 className="mt-2 font-sans text-xl font-semibold tracking-tight text-ink">
            {mode === "generate"
              ? "Generating interview questions"
              : "Synthesizing scorecard"}
          </h2>
          <p className="mt-2 min-h-[1.25rem] font-mono text-sm text-emerald">
            {steps[stepIdx]}
          </p>
        </div>

        {mode === "generate" && (
          <div className="space-y-2">
            <p className="label-caps text-ink-muted">
              {count ?? "—"} MCQs · {(difficulty || "senior").toUpperCase()}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {topics.map((t) => (
                <span
                  key={t}
                  data-busy-topic
                  className="label-caps rounded-full border border-emerald/30 bg-emerald-soft px-2.5 py-1 text-emerald"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
