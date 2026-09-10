"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { TOPIC_CLUSTERS } from "@/lib/topics";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Pressable } from "@/components/motion/Pressable";
import { TiltCard } from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { useMotion } from "@/components/motion/GsapProvider";

const HeroCanvas = dynamic(
  () =>
    import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

const FEATURES = [
  "Zero Synthetic Latency",
  "Full AST Static Telemetry",
  "L6/L7 Rubric Mapping",
];

const METRICS = [
  {
    label: "Evaluation Latency",
    value: "0.24s",
    detail: "Median end-to-end token inference · P99 < 0.42s",
  },
  {
    label: "Evaluation Runtime",
    value: "Real-time",
    detail: "Multi-modal synthesis · SANDBOX ISOLATED",
  },
  {
    label: "Rubric Precision",
    value: "99.4%",
    detail: "Topic alignment vs L6/L7 bars · 4,200 calibrations",
  },
];

export function OverviewClient() {
  const root = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 12, duration: 0.45 })
        .from(
          "[data-hero-word]",
          { opacity: 0, y: 28, stagger: 0.06, duration: 0.55 },
          "-=0.15"
        )
        .from(
          "[data-hero-copy]",
          { opacity: 0, y: 16, duration: 0.45 },
          "-=0.25"
        )
        .from(
          "[data-hero-cta]",
          { opacity: 0, y: 14, stagger: 0.08, duration: 0.4 },
          "-=0.2"
        )
        .from(
          "[data-hero-aside]",
          { opacity: 0, x: 24, duration: 0.55 },
          "-=0.35"
        );
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={root} className="relative space-y-10">
      <div className="pointer-events-none absolute -inset-x-4 -top-6 h-[520px] md:-inset-x-6 lg:-inset-x-12">
        <HeroCanvas />
      </div>

      <div className="label-caps relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 text-ink-muted">
        <span>{"SYSTEM SPECIFICATION // COGNITIVE INTERVIEW EVALUATION"}</span>
        <span>{"NODE: LHR-09 // LATENCY 19MS · STABILITY: NOMINAL"}</span>
      </div>

      <section className="relative grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
        <div className="space-y-6">
          <p data-hero-eyebrow className="label-caps text-emerald">
            ARCH-V4.2 L7 PROTOCOL SYNCHRONIZED
          </p>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-[48px] lg:leading-[56px]">
            <span data-hero-word className="inline-block">Practice</span>{" "}
            <span data-hero-word className="inline-block">Interviews.</span>{" "}
            <span data-hero-word className="inline-block text-emerald">
              Refined by AI.
            </span>
          </h1>
          <p
            data-hero-copy
            className="max-w-xl font-body text-base leading-relaxed text-ink-secondary"
          >
            High-signal technical assessments calibrated for Staff and Principal
            engineering interviews—modeled after Level 6+ hiring criteria with
            adversarial probing and deterministic telemetry.
          </p>

          <div className="flex flex-wrap gap-3">
            <div data-hero-cta>
              <MagneticButton
                href="/setup"
                className="group items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas hover:bg-zinc-200"
              >
                Start Interview Session
                <span className="text-emerald transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </MagneticButton>
            </div>
            <div data-hero-cta>
              <MagneticButton
                href="#topics"
                strength={5}
                className="items-center gap-2 rounded-full border border-white/[0.08] bg-surface-raised px-5 py-2.5 text-sm text-ink-secondary hover:border-surface-high hover:text-ink"
              >
                Read Calibration Specs
              </MagneticButton>
            </div>
          </div>

          <ul className="flex flex-col gap-2 pt-2">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-ink-secondary"
              >
                <span className="text-emerald">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside data-hero-aside className="space-y-3">
          <TiltCard className="panel-raised space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="label-caps text-ink-muted">
                Active Session Simulation
              </span>
              <span className="label-caps flex items-center gap-1.5 text-emerald">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
                REC 08:42
              </span>
            </div>
            <pre className="overflow-x-auto rounded-panel border border-surface-high bg-canvas p-3 font-mono text-[12px] leading-5 text-ink-secondary">
{`> Probe: Consensus under partition
  Candidate: Prefer AP + CRDT merge
  Kernel: Depth of inquiry`}
            </pre>
            <div>
              <div className="label-caps mb-1 flex justify-between text-ink-muted">
                <span>Depth of Inquiry</span>
                <span className="text-emerald">94.8%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
                <div className="h-full w-[94.8%] rounded-full bg-emerald" />
              </div>
            </div>
          </TiltCard>

          <div className="grid grid-cols-2 gap-3">
            <TiltCard className="panel p-4" maxTilt={6}>
              <p className="label-caps text-ink-muted">Edge Cases</p>
              <p className="mt-2 font-mono text-2xl text-ink">14/14</p>
            </TiltCard>
            <TiltCard className="panel p-4" maxTilt={6}>
              <p className="label-caps text-ink-muted">Taxonomy</p>
              <p className="mt-2 font-mono text-2xl text-emerald">L7+ ARCH</p>
            </TiltCard>
          </div>

          <TiltCard className="panel flex items-center justify-between p-4" maxTilt={5}>
            <div>
              <p className="label-caps text-ink-muted">Evaluation Kernel</p>
              <p className="mt-1 text-sm text-ink">Kernel 4.8 · Calibrated</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald/40 bg-emerald-soft font-mono text-xs text-emerald">
              4.8
            </div>
          </TiltCard>
        </aside>
      </section>

      <ParallaxLayer speed={28}>
        <Reveal>
          <section id="topics" className="relative space-y-4">
            <p className="label-caps text-ink-muted">Calibrated Topic Matrices</p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_CLUSTERS.map((t) => (
                <Pressable
                  key={t.id}
                  type="button"
                  flashRing
                  className="label-caps rounded-full border border-surface-high bg-surface px-3 py-1.5 text-ink-secondary transition hover:border-emerald/40 hover:text-ink"
                >
                  {t.title}{" "}
                  <span className="text-ink-muted">{`// ${t.weight} WT`}</span>
                </Pressable>
              ))}
            </div>
          </section>
        </Reveal>
      </ParallaxLayer>

      <ParallaxLayer speed={50}>
        <section className="relative grid gap-4 md:grid-cols-3">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <TiltCard className="panel p-5" maxTilt={6}>
                <p className="label-caps text-ink-muted">{m.label}</p>
                <p className="mt-3 font-mono text-3xl tracking-tight text-ink">
                  {m.value}
                </p>
                <p className="mt-2 text-sm text-ink-secondary">{m.detail}</p>
              </TiltCard>
            </Reveal>
          ))}
        </section>
      </ParallaxLayer>
    </div>
  );
}
