"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { generateQuestions } from "@/lib/api";
import { saveSession } from "@/lib/session";
import {
  DIFFICULTY_LABELS,
  QUESTION_COUNTS,
  TOPIC_CLUSTERS,
} from "@/lib/topics";
import type { Difficulty } from "@/lib/types";
import { TiltCard } from "@/components/motion/TiltCard";
import { Pressable } from "@/components/motion/Pressable";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { useMotion } from "@/components/motion/GsapProvider";

const DIFF_KEYS = Object.keys(DIFFICULTY_LABELS) as Difficulty[];

export default function SetupPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  const [selected, setSelected] = useState<string[]>([
    "DSA",
    "System Design",
    "Java",
  ]);
  const [difficulty, setDifficulty] = useState<Difficulty>("senior");
  const [count, setCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const armed = selected.length;
  const specs = DIFFICULTY_LABELS[difficulty];
  const estMinutes = useMemo(() => Math.max(5, count * 2), [count]);
  const diffIndex = DIFF_KEYS.indexOf(difficulty);

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-setup-card]", {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.from("[data-setup-dock]", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!pillRef.current || !trackRef.current || reducedMotion) return;
    const buttons = trackRef.current.querySelectorAll<HTMLButtonElement>(
      "[data-diff-btn]"
    );
    const btn = buttons[diffIndex];
    if (!btn) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    gsap.to(pillRef.current, {
      x: btnRect.left - trackRect.left,
      width: btnRect.width,
      duration: 0.28,
      ease: "power3.out",
    });
  }, [diffIndex, reducedMotion]);

  function toggleTopic(id: string) {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id];
      return next;
    });
  }

  async function beginSession() {
    if (selected.length === 0) {
      setError("Select at least one technical cluster.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const batch = await generateQuestions({
        topics: selected,
        count,
        difficulty,
      });
      saveSession({
        config: { topics: selected, difficulty, count },
        questions: batch.questions,
        answers: [],
        startedAt: new Date().toISOString(),
      });
      router.push("/interview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate questions");
      setLoading(false);
    }
  }

  return (
    <div ref={root} className="space-y-8 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-caps mb-3 flex flex-wrap gap-4 text-ink-muted">
            <span className="text-emerald">{"01 // TOPIC VECTOR"}</span>
            <span>{"02 // SENIORITY LEVEL"}</span>
            <span>{"03 // DURATION & FORMAT"}</span>
          </div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
            Configure Assessment Vector
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Calibrate system parameters, technical domains, and AI interviewer
            strictness levels.
          </p>
        </div>
        <span className="label-caps rounded-full border border-surface-high bg-surface px-3 py-1 text-ink-muted">
          SYNTHETIC_EVAL_v2.4
        </span>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="label-caps text-ink-muted">
            01 / TECHNICAL KNOWLEDGE CLUSTERS
          </h2>
          <span className="label-caps text-emerald">
            {armed} / {TOPIC_CLUSTERS.length} CLUSTERS ARMED
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPIC_CLUSTERS.map((cluster) => {
            const active = selected.includes(cluster.id);
            return (
              <div key={cluster.id} data-setup-card>
                <TiltCard
                  className={`panel-raised cursor-pointer p-4 transition ${
                    active ? "shadow-ring" : ""
                  }`}
                  maxTilt={7}
                  onClick={() => {
                    toggleTopic(cluster.id);
                    if (!reducedMotion) {
                      const el = document.getElementById(`cluster-${cluster.id}`);
                      if (el) {
                        gsap.fromTo(
                          el,
                          { scale: 0.97 },
                          {
                            scale: 1,
                            duration: 0.28,
                            ease: "power3.out",
                            boxShadow: active
                              ? "0 0 0 0 rgba(16,185,129,0)"
                              : "0 0 0 1px #10B981",
                          }
                        );
                      }
                    }
                  }}
                >
                  <div id={`cluster-${cluster.id}`} className="flex flex-col items-start text-left">
                    <div className="mb-3 flex w-full items-center justify-between">
                      <span className="label-caps text-ink-muted">
                        {cluster.code} {cluster.category}
                      </span>
                      <span
                        className={`label-caps ${
                          active ? "text-emerald" : "text-ink-muted"
                        }`}
                      >
                        {active ? "[✓ SELECTED]" : "STANDBY"}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-ink">
                      {cluster.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                      {cluster.description}
                    </p>
                    <div className="mt-4 label-caps text-ink-muted">
                      {active ? `WEIGHT ${cluster.weight}%` : "STANDBY"}
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </section>

      <Reveal>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="label-caps text-ink-muted">02 / SENIORITY CALIBRATION</h2>
            <span className="label-caps text-ink-muted">
              INDEX: {difficulty.toUpperCase()}_TARGET
            </span>
          </div>
          <div
            ref={trackRef}
            className="relative inline-flex rounded-full border border-surface-high bg-surface p-1"
          >
            <div
              ref={pillRef}
              className="absolute bottom-1 top-1 rounded-full bg-ink"
              style={{ width: 120, left: 4 }}
            />
            {DIFF_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                data-diff-btn
                onClick={() => setDifficulty(key)}
                className={`relative z-10 rounded-full px-4 py-2 text-sm transition ${
                  difficulty === key
                    ? "font-medium text-canvas"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {DIFFICULTY_LABELS[key].label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Complexity Expectation", specs.complexity],
              ["System Scale Scope", specs.scale],
              ["Prompt Inquisition", specs.probing],
            ].map(([k, v]) => (
              <TiltCard key={k} className="panel p-4" maxTilt={5}>
                <p className="label-caps text-ink-muted">{k}</p>
                <p
                  className={`mt-2 font-mono text-sm ${
                    k.includes("Inquisition") ? "text-emerald" : "text-ink"
                  }`}
                >
                  {v}
                </p>
              </TiltCard>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="space-y-4">
          <h2 className="label-caps text-ink-muted">03 / DURATION & FORMAT</h2>
          <div className="flex flex-wrap gap-2">
            {QUESTION_COUNTS.map((n) => (
              <Pressable
                key={n}
                type="button"
                flashRing
                onClick={() => setCount(n)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  count === n
                    ? "border-emerald bg-emerald-soft text-emerald"
                    : "border-surface-high bg-surface text-ink-secondary hover:text-ink"
                }`}
              >
                {n} Questions
              </Pressable>
            ))}
          </div>
          <div className="panel-raised flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-medium">Interactive Audio & Code Canvas</h3>
              <p className="mt-1 text-sm text-ink-secondary">
                Real-time bi-directional voice synthesis with live AST syntax
                verification. MCQ is active for this MVP; Text/Voice remain UI stubs.
              </p>
            </div>
            <div className="label-caps space-y-1 text-right text-ink-muted">
              <div>
                LATENCY TARGET <span className="text-emerald">&lt; 120ms</span>
              </div>
              <div>FEEDBACK RUNTIME GPT-4o Omnimodal</div>
            </div>
          </div>
        </section>
      </Reveal>

      {error && (
        <p className="rounded-panel border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div
        data-setup-dock
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-canvas/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-12">
          <p className="label-caps text-ink-secondary">
            ● {armed} Topics Selected ● {count} Questions ● Est. {estMinutes} Mins
            ● Mode: Audio/MCQ
          </p>
          <MagneticButton
            disabled={loading || armed === 0}
            onClick={() => void beginSession()}
            className="items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" />
                Arming Session…
              </span>
            ) : (
              "Begin Session →"
            )}
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
