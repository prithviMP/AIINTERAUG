"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { evaluateSession } from "@/lib/api";
import { clearSession, loadSession, saveSession } from "@/lib/session";
import type { InterviewSession, OptionId } from "@/lib/types";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Pressable } from "@/components/motion/Pressable";
import { useMotion } from "@/components/motion/GsapProvider";

type InputMode = "mcq" | "text" | "voice";

const TIMER_SECONDS = 5 * 60;
const MODES: { id: InputMode; label: string }[] = [
  { id: "mcq", label: "Multiple Choice" },
  { id: "text", label: "Text Explanation" },
  { id: "voice", label: "Voice Input" },
];

export default function InterviewPage() {
  const router = useRouter();
  const { reducedMotion } = useMotion();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const modeTrackRef = useRef<HTMLDivElement | null>(null);
  const modePillRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [mode, setMode] = useState<InputMode>("mcq");
  const [remaining, setRemaining] = useState(TIMER_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setHydrated(true);
    if (s?.answers.length) {
      setIndex(Math.min(s.answers.length, s.questions.length - 1));
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    setRemaining(TIMER_SECONDS);
    const existing = session.answers.find(
      (a) => a.questionId === session.questions[index]?.id
    );
    setSelected(existing?.selected ?? null);
  }, [index, session]);

  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [session, index]);

  useLayoutEffect(() => {
    if (!contentRef.current || reducedMotion) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }
    );
  }, [index, reducedMotion]);

  useLayoutEffect(() => {
    if (!modeTrackRef.current || !modePillRef.current || reducedMotion) return;
    const buttons = modeTrackRef.current.querySelectorAll<HTMLButtonElement>(
      "[data-mode-btn]"
    );
    const idx = MODES.findIndex((m) => m.id === mode);
    const btn = buttons[idx];
    if (!btn) return;
    const track = modeTrackRef.current.getBoundingClientRect();
    const rect = btn.getBoundingClientRect();
    gsap.to(modePillRef.current, {
      x: rect.left - track.left,
      width: rect.width,
      duration: 0.25,
      ease: "power3.out",
    });
  }, [mode, reducedMotion]);

  const question = session?.questions[index];
  const total = session?.questions.length ?? 0;
  const isLast = index >= total - 1;

  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const s = (remaining % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [remaining]);

  const persistAnswer = useCallback(
    (option: OptionId) => {
      if (!session || !question) return session;
      const answers = [
        ...session.answers.filter((a) => a.questionId !== question.id),
        { questionId: question.id, selected: option },
      ];
      const next = { ...session, answers };
      saveSession(next);
      setSession(next);
      return next;
    },
    [session, question]
  );

  async function finish(nextSession: InterviewSession) {
    setSubmitting(true);
    setError(null);
    try {
      const submissions = nextSession.questions.map((q) => {
        const ans = nextSession.answers.find((a) => a.questionId === q.id);
        return {
          topic: q.topic,
          question: q.question,
          user_answer: ans?.selected ?? "",
          correct_answer: q.correct_option_id,
        };
      });
      const evaluation = await evaluateSession(submissions);
      saveSession({ ...nextSession, evaluation });
      router.push("/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed");
      setSubmitting(false);
    }
  }

  function onSelect(option: OptionId) {
    setSelected(option);
    persistAnswer(option);
    if (!reducedMotion) {
      const el = document.getElementById(`opt-${option}`);
      if (el) {
        gsap.fromTo(
          el,
          { scale: 0.98 },
          {
            scale: 1,
            duration: 0.22,
            ease: "power3.out",
            boxShadow: "0 0 0 1px #10B981",
          }
        );
      }
    }
  }

  async function onSubmitNext() {
    if (!session || !question || !selected) {
      setError("Select an option before continuing.");
      return;
    }
    const next = persistAnswer(selected);
    if (!next) return;
    if (isLast) {
      await finish(next);
    } else {
      setError(null);
      setIndex((i) => i + 1);
    }
  }

  function onSkip() {
    if (!reducedMotion && skipRef.current) {
      gsap.fromTo(
        skipRef.current,
        { x: 0 },
        {
          keyframes: [
            { x: -6, duration: 0.06 },
            { x: 5, duration: 0.06 },
            { x: -3, duration: 0.06 },
            { x: 0, duration: 0.08 },
          ],
          ease: "power2.out",
        }
      );
    }
    if (!session || !question) return;
    if (isLast) {
      const next = persistAnswer(selected ?? "A");
      if (next) void finish(next);
      return;
    }
    setIndex((i) => i + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question || mode !== "mcq") return;
      const map: Record<string, OptionId> = {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        a: "A",
        b: "B",
        c: "C",
        d: "D",
      };
      if (map[e.key]) onSelect(map[e.key]);
      if (e.key === "Enter") void onSubmitNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, selected, mode, isLast, session]);

  if (!hydrated) {
    return (
      <p className="label-caps text-ink-muted">Loading session runtime…</p>
    );
  }

  if (!session || !question) {
    return (
      <div className="panel space-y-4 p-8 text-center">
        <h1 className="text-xl font-medium">No active session</h1>
        <p className="text-sm text-ink-secondary">
          Configure an assessment vector before entering the live room.
        </p>
        <MagneticButton
          href="/setup"
          className="items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas"
        >
          Open Setup Engine →
        </MagneticButton>
      </div>
    );
  }

  const difficultyLabel =
    session.config.difficulty === "staff"
      ? "L6 STAFF ARCHITECT"
      : session.config.difficulty === "junior"
        ? "L4 MID ENGINEER"
        : "L5 SENIOR ENGINEER";

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-caps text-ink">
            QUESTION {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <span className="label-caps rounded-full border border-surface-high bg-surface px-2.5 py-1 text-ink-muted">
            {`[${question.topic.toUpperCase()} // CACHING]`}
          </span>
          <span className="label-caps text-ink-secondary">
            ● LEVEL: {difficultyLabel}
          </span>
        </div>
        <span
          className={`label-caps rounded-panel border px-3 py-1.5 ${
            remaining < 60
              ? "border-red-800 bg-red-950/50 text-red-300"
              : "border-surface-high bg-surface text-ink-secondary"
          }`}
        >
          ● {mmss} REMAINING
        </span>
      </div>

      <div ref={contentRef} className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="label-caps text-ink-muted">SCENARIO SPECIFICATION</span>
            <span className="label-caps text-emerald">LATENCY TARGET &lt; 5MS</span>
          </div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl">
            {question.question}
          </h1>

          {question.code_snippet && (
            <div className="overflow-hidden rounded-panel border border-surface-high bg-canvas">
              <div className="flex items-center justify-between border-b border-surface-high px-3 py-2">
                <span className="label-caps text-ink-muted">
                  {question.code_language || "snippet"}.src
                </span>
                <span className="label-caps text-emerald">
                  IDEMPOTENCY_KEY: SHA256_V2
                </span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-5 text-ink-secondary">
                {question.code_snippet}
              </pre>
            </div>
          )}

          <div className="panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-caps text-ink-muted">
                REPLICA LAG RUNTIME STREAM
              </span>
              <span className="font-mono text-sm text-emerald">134.2 ms (p99.99)</span>
            </div>
            <svg viewBox="0 0 320 48" className="h-12 w-full text-emerald" aria-hidden>
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                points="0,30 20,28 40,32 60,18 80,22 100,14 120,20 140,10 160,16 180,12 200,24 220,8 240,18 260,14 280,22 300,16 320,20"
              />
            </svg>
          </div>
        </section>

        <section className="space-y-4">
          <div
            ref={modeTrackRef}
            className="relative inline-flex rounded-full border border-surface-high bg-surface p-1"
          >
            <div
              ref={modePillRef}
              className="absolute bottom-1 top-1 rounded-full bg-ink"
              style={{ width: 120, left: 4 }}
            />
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                data-mode-btn
                onClick={() => setMode(m.id)}
                className={`relative z-10 rounded-full px-3 py-1.5 text-xs transition sm:text-sm ${
                  mode === m.id
                    ? "font-medium text-canvas"
                    : "text-ink-secondary"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "mcq" ? (
            <div className="space-y-3">
              {question.options.map((opt) => {
                const active = selected === opt.id;
                const dimmed = selected !== null && !active;
                return (
                  <Pressable
                    key={opt.id}
                    id={`opt-${opt.id}`}
                    type="button"
                    flashRing
                    onClick={() => onSelect(opt.id)}
                    className={`w-full rounded-panel border p-4 text-left transition ${
                      active
                        ? "border-emerald bg-emerald-soft shadow-ring"
                        : "border-white/[0.08] bg-surface hover:border-white/20"
                    } ${dimmed ? "opacity-55" : "opacity-100"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`label-caps mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                          active
                            ? "border-emerald bg-emerald text-canvas"
                            : "border-surface-high text-ink-muted"
                        }`}
                      >
                        {active ? "✓" : opt.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed text-ink">{opt.text}</p>
                        {active && (
                          <p className="label-caps mt-2 text-emerald">
                            SELECTED · AT-LEAST-ONCE COMMIT
                          </p>
                        )}
                      </div>
                    </div>
                  </Pressable>
                );
              })}
            </div>
          ) : (
            <div className="panel space-y-3 p-5">
              <p className="label-caps text-warn">STUB MODE</p>
              <p className="text-sm text-ink-secondary">
                {mode === "text"
                  ? "Text explanation input will be enabled in a later release. Use Multiple Choice for this MVP."
                  : "Voice synthesis capture is UI-only for this MVP. Switch back to Multiple Choice."}
              </p>
              <Pressable
                type="button"
                onClick={() => setMode("mcq")}
                className="rounded-full border border-emerald bg-emerald-soft px-4 py-2 text-sm text-emerald"
              >
                Return to MCQ
              </Pressable>
            </div>
          )}

          <div className="panel flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald/30 bg-emerald-soft text-xs text-emerald">
              AI
            </div>
            <div>
              <p className="label-caps text-ink-muted">AI PROCTOR EVALUATION</p>
              <p className="text-sm text-ink-secondary">
                Monitoring structural coherence & concurrency rigor
              </p>
              <p className="label-caps mt-1 text-emerald">STREAM CONNECTED</p>
            </div>
          </div>
        </section>
      </div>

      {error && (
        <p className="rounded-panel border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 md:px-6 lg:px-12">
          <button
            ref={skipRef}
            type="button"
            onClick={onSkip}
            className="text-sm text-ink-secondary will-change-transform hover:text-ink"
          >
            Skip Question
          </button>
          <p className="label-caps hidden text-ink-muted sm:block">
            1-4 Select Option · Enter Submit
          </p>
          <div className="flex items-center gap-2">
            <Pressable
              type="button"
              onClick={() => {
                clearSession();
                router.push("/setup");
              }}
              className="rounded-full border border-surface-high px-3 py-2 text-xs text-ink-muted"
              title="Abort session"
            >
              ✎
            </Pressable>
            <MagneticButton
              disabled={submitting || !selected}
              onClick={() => void onSubmitNext()}
              className="items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas disabled:opacity-50"
            >
              {submitting
                ? "Evaluating…"
                : isLast
                  ? "Submit & Finish →"
                  : "Submit & Next →"}
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
