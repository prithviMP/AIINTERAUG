"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateQuestions } from "@/lib/api";
import { saveSession } from "@/lib/session";
import {
  DIFFICULTY_LABELS,
  QUESTION_COUNTS,
  TOPIC_CLUSTERS,
} from "@/lib/topics";
import type { Difficulty } from "@/lib/types";

export default function SetupPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(["DSA", "System Design", "Java"]);
  const [difficulty, setDifficulty] = useState<Difficulty>("senior");
  const [count, setCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const armed = selected.length;
  const specs = DIFFICULTY_LABELS[difficulty];

  const estMinutes = useMemo(() => Math.max(5, count * 2), [count]);

  function toggleTopic(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-28">
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
              <button
                key={cluster.id}
                type="button"
                onClick={() => toggleTopic(cluster.id)}
                className={`panel-raised group flex flex-col items-start p-4 text-left transition ${
                  active ? "shadow-ring" : "hover:border-white/20"
                }`}
              >
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
                <h3 className="text-base font-medium text-ink">{cluster.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                  {cluster.description}
                </p>
                <div className="mt-4 label-caps text-ink-muted">
                  {active ? `WEIGHT ${cluster.weight}%` : "STANDBY"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="label-caps text-ink-muted">02 / SENIORITY CALIBRATION</h2>
          <span className="label-caps text-ink-muted">
            INDEX: {difficulty.toUpperCase()}_TARGET
          </span>
        </div>
        <div className="inline-flex rounded-full border border-surface-high bg-surface p-1">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setDifficulty(key)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                difficulty === key
                  ? "bg-ink font-medium text-canvas"
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
            <div key={k} className="panel p-4">
              <p className="label-caps text-ink-muted">{k}</p>
              <p
                className={`mt-2 font-mono text-sm ${
                  k.includes("Inquisition") ? "text-emerald" : "text-ink"
                }`}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="label-caps text-ink-muted">03 / DURATION & FORMAT</h2>
        <div className="flex flex-wrap gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                count === n
                  ? "border-emerald bg-emerald-soft text-emerald"
                  : "border-surface-high bg-surface text-ink-secondary hover:text-ink"
              }`}
            >
              {n} Questions
            </button>
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

      {error && (
        <p className="rounded-panel border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-12">
          <p className="label-caps text-ink-secondary">
            ● {armed} Topics Selected ● {count} Questions ● Est. {estMinutes} Mins
            ● Mode: Audio/MCQ
          </p>
          <button
            type="button"
            disabled={loading || armed === 0}
            onClick={beginSession}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Arming Session…" : "Begin Session →"}
          </button>
        </div>
      </div>
    </div>
  );
}
