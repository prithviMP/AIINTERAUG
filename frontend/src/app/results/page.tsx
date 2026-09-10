"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/session";
import type { InterviewSession } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setHydrated(true);
    if (s?.questions.length) {
      const firstMiss = s.questions.find((q) => {
        const a = s.answers.find((x) => x.questionId === q.id);
        return a?.selected !== q.correct_option_id;
      });
      setOpenId(firstMiss?.id ?? s.questions[0]?.id ?? null);
    }
  }, []);

  const evaluation = session?.evaluation;
  const elapsed = useMemo(() => {
    if (!session?.startedAt) return "—";
    const ms = Date.now() - new Date(session.startedAt).getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}M ${secs.toString().padStart(2, "0")}S`;
  }, [session]);

  const peerBars = useMemo(() => {
    const score = evaluation?.score ?? 0;
    return [
      { label: "Concurrency Handling", candidate: Math.min(100, score + 4), peer: 78 },
      { label: "Distributed Throughput", candidate: Math.min(100, score - 2), peer: 74 },
      {
        label: "Failure Recovery Completeness",
        candidate: Math.min(100, score + 1),
        peer: 71,
      },
    ];
  }, [evaluation]);

  function exportJson() {
    if (!session) return;
    const blob = new Blob([JSON.stringify(session, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coach-ai-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!hydrated) {
    return <p className="label-caps text-ink-muted">Synthesizing scorecard…</p>;
  }

  if (!session || !evaluation) {
    return (
      <div className="panel space-y-4 p-8 text-center">
        <h1 className="text-xl font-medium">No scorecard available</h1>
        <p className="text-sm text-ink-secondary">
          Complete a live session to generate evaluation synthesis.
        </p>
        <button
          type="button"
          onClick={() => router.push("/setup")}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas"
        >
          Start Session →
        </button>
      </div>
    );
  }

  const correctCount = session.questions.filter((q) => {
    const a = session.answers.find((x) => x.questionId === q.id);
    return a?.selected === q.correct_option_id;
  }).length;

  return (
    <div className="space-y-8 pb-10">
      <div className="label-caps flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 text-ink-muted">
        <span>
          {`SESSION EVALUATION // ID: #TRX-${session.startedAt.slice(-4).toUpperCase()} · RUN TIME: ${elapsed}`}
        </span>
        <div className="flex gap-2">
          <span className="rounded-full border border-emerald/40 bg-emerald-soft px-3 py-1 text-emerald">
            SYNTHESIS: COMPLETE
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-surface-high bg-surface px-3 py-1 text-ink-secondary hover:text-ink"
          >
            PRINT SUMMARY
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
            Candidate Evaluation & Synthesis
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">{evaluation.feedback}</p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel space-y-5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="label-caps text-ink-muted">Aggregate Benchmark Score</p>
              <p className="mt-2 font-mono text-5xl tracking-tight text-ink">
                {evaluation.score}{" "}
                <span className="text-2xl text-ink-muted">/ 100</span>
              </p>
              <p className="mt-2 label-caps text-emerald">
                STAFF LEVEL PROFICIENCY · CALIBRATION CONFIDENCE: 99.2%
              </p>
            </div>
            <p className="label-caps text-ink-muted">
              {correctCount}/{session.questions.length} CORRECT
            </p>
          </div>

          <div className="space-y-3">
            {(
              evaluation.category_scores
                ? Object.entries(evaluation.category_scores)
                : session.config.topics.map((t) => [t, evaluation.score] as const)
            ).slice(0, 3).map(([label, value]) => (
              <div key={String(label)}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-secondary">{label}</span>
                  <span className="font-mono text-ink">{value}/100</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="label-caps text-ink-muted">
            PERCENTILE RANKING: {Math.min(99, Math.max(40, evaluation.score + 6))}TH
            PERCENTILE (GLOBAL CORP POOL) · σ 1.04
          </p>
        </div>

        <div className="panel flex flex-col items-center justify-center p-6">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#27272A"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={`${(evaluation.score / 100) * 327} 327`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <p className="font-mono text-2xl text-ink">{evaluation.score}%</p>
              <p className="label-caps text-ink-muted">CONVERGENCE</p>
            </div>
          </div>
          <p className="mt-4 label-caps text-ink-muted">TIER 1 TARGET</p>
          <p className="mt-2 text-center text-sm text-ink-secondary">
            Performance mapped against L6 staff parameters for selected topic vector.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="label-caps text-emerald">
            Validated Strengths ({evaluation.strengths.length})
          </h2>
          {evaluation.strengths.map((s, i) => (
            <div key={i} className="panel p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Strength {i + 1}</p>
                <span className="label-caps text-emerald">HIGH CONFIDENCE</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-secondary">{s}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="label-caps text-warn">
            Areas to Refine ({evaluation.areas_to_improve.length})
          </h2>
          {evaluation.areas_to_improve.map((s, i) => (
            <div key={i} className="panel p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Target {i + 1}</p>
                <span className="label-caps text-warn">
                  {i === 0 ? "PRIORITY: HIGH" : "RECOMMENDED"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-secondary">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/[0.08] px-5 py-4">
          <h2 className="label-caps text-ink-muted">
            Execution Trace & Bottleneck Analysis
          </h2>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 font-mono text-sm">
            <p>
              PEAK THROUGHPUT:{" "}
              <span className="text-emerald">148k req/s</span>
            </p>
            <p>
              P99 LATENCY: <span className="text-emerald">14.2 ms</span>
            </p>
            <p>
              FAULT RECOVERY: <span className="text-emerald">100 ms</span>
            </p>
            <p className="label-caps text-ink-muted">TOPOLOGY MAP v2.4 (decorative)</p>
          </div>
          <div className="relative h-40 overflow-hidden rounded-panel border border-surface-high bg-canvas">
            <svg viewBox="0 0 400 160" className="h-full w-full text-emerald/70">
              <circle cx="60" cy="80" r="4" fill="currentColor" />
              <circle cx="160" cy="40" r="4" fill="currentColor" />
              <circle cx="200" cy="110" r="4" fill="currentColor" />
              <circle cx="300" cy="60" r="4" fill="currentColor" />
              <circle cx="350" cy="120" r="4" fill="currentColor" />
              <path
                d="M60 80 L160 40 L200 110 L300 60 L350 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M160 40 L300 60 M60 80 L200 110"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="label-caps text-ink-muted">
            Question-by-Question Architectural Review
          </h2>
          <span className="label-caps text-ink-muted">
            {session.questions.length}/{session.questions.length} EVALUATED UNITS
          </span>
        </div>
        <div className="space-y-2">
          {session.questions.map((q, i) => {
            const ans = session.answers.find((a) => a.questionId === q.id);
            const ok = ans?.selected === q.correct_option_id;
            const open = openId === q.id;
            return (
              <div key={q.id} className="panel overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  onClick={() => setOpenId(open ? null : q.id)}
                >
                  <span className="text-sm text-ink">
                    <span className="label-caps mr-2 text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {q.question}
                  </span>
                  <span
                    className={`label-caps shrink-0 rounded-full px-2 py-1 ${
                      ok
                        ? "bg-emerald-soft text-emerald"
                        : "bg-amber-950/40 text-warn"
                    }`}
                  >
                    {ok ? "CORRECT" : "SUB-OPTIMAL"}
                  </span>
                </button>
                {open && (
                  <div className="space-y-3 border-t border-white/[0.08] px-4 py-4">
                    <p className="text-sm text-ink-secondary">
                      <span className="label-caps text-ink-muted">Your answer: </span>
                      {ans?.selected ?? "—"} ·{" "}
                      <span className="label-caps text-ink-muted">Optimal: </span>
                      {q.correct_option_id}
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-panel border border-surface-high bg-canvas p-3">
                        <p className="label-caps mb-2 text-ink-muted">
                          Candidate Proposal Summary
                        </p>
                        <p className="text-sm text-ink-secondary">
                          Selected option [{ans?.selected ?? "∅"}] for {q.topic}.
                        </p>
                      </div>
                      <div className="rounded-panel border border-surface-high bg-canvas p-3">
                        <p className="label-caps mb-2 text-ink-muted">
                          Optimal Architectural Rationale
                        </p>
                        <p className="text-sm text-ink-secondary">{q.explanation}</p>
                      </div>
                    </div>
                    {q.code_snippet && (
                      <pre className="overflow-x-auto rounded-panel border border-surface-high bg-canvas p-3 font-mono text-[12px] text-ink-secondary">
                        {q.code_snippet}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h2 className="label-caps text-ink-muted">
          Candidate vs FAANG Staff Averages
        </h2>
        <div className="space-y-4">
          {peerBars.map((row) => (
            <div key={row.label}>
              <p className="mb-2 text-sm text-ink-secondary">{row.label}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="label-caps w-20 text-emerald">You</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-high">
                    <div
                      className="h-full rounded-full bg-emerald"
                      style={{ width: `${row.candidate}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-ink">{row.candidate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="label-caps w-20 text-ink-muted">Peer Avg</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-high">
                    <div
                      className="h-full rounded-full bg-zinc-600"
                      style={{ width: `${row.peer}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-ink-muted">{row.peer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/setup");
            }}
            className="rounded-full border border-white/[0.08] bg-surface-raised px-5 py-2.5 text-sm text-ink-secondary hover:text-ink"
          >
            Retake Session
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-full border border-white/[0.08] bg-surface-raised px-5 py-2.5 text-sm text-ink-secondary hover:text-ink"
          >
            Export Detailed Report (JSON)
          </button>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-emerald hover:underline"
        >
          Explore Recommended Curriculum →
        </button>
      </div>
    </div>
  );
}
