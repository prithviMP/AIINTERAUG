import Link from "next/link";
import { TOPIC_CLUSTERS } from "@/lib/topics";

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

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      <div className="label-caps flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 text-ink-muted">
        <span>{"SYSTEM SPECIFICATION // COGNITIVE INTERVIEW EVALUATION"}</span>
        <span>{"NODE: LHR-09 // LATENCY 19MS · STABILITY: NOMINAL"}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
        <div className="space-y-6">
          <p className="label-caps text-emerald">
            ARCH-V4.2 L7 PROTOCOL SYNCHRONIZED
          </p>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-[48px] lg:leading-[56px]">
            Practice Interviews.{" "}
            <span className="text-emerald">Refined by AI.</span>
          </h1>
          <p className="max-w-xl font-body text-base leading-relaxed text-ink-secondary">
            High-signal technical assessments calibrated for Staff and Principal
            engineering interviews—modeled after Level 6+ hiring criteria with
            adversarial probing and deterministic telemetry.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-zinc-200"
            >
              Start Interview Session
              <span className="text-emerald">→</span>
            </Link>
            <a
              href="#topics"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-raised px-5 py-2.5 text-sm text-ink-secondary transition hover:border-surface-high hover:text-ink"
            >
              Read Calibration Specs
            </a>
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

        <aside className="space-y-3">
          <div className="panel-raised space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="label-caps text-ink-muted">Active Session Simulation</span>
              <span className="label-caps flex items-center gap-1.5 text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                REC 08:42
              </span>
            </div>
            <pre className="overflow-x-auto rounded-panel border border-surface-high bg-canvas p-3 font-mono text-[12px] leading-5 text-ink-secondary">
{`> Probe: Consensus under partition
  Candidate: Prefer AP + CRDT merge
  Kernel: Depth of inquiry`}
            </pre>
            <div>
              <div className="mb-1 flex justify-between label-caps text-ink-muted">
                <span>Depth of Inquiry</span>
                <span className="text-emerald">94.8%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
                <div className="h-full w-[94.8%] rounded-full bg-emerald" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="panel p-4">
              <p className="label-caps text-ink-muted">Edge Cases</p>
              <p className="mt-2 font-mono text-2xl text-ink">14/14</p>
            </div>
            <div className="panel p-4">
              <p className="label-caps text-ink-muted">Taxonomy</p>
              <p className="mt-2 font-mono text-2xl text-emerald">L7+ ARCH</p>
            </div>
          </div>

          <div className="panel flex items-center justify-between p-4">
            <div>
              <p className="label-caps text-ink-muted">Evaluation Kernel</p>
              <p className="mt-1 text-sm text-ink">Kernel 4.8 · Calibrated</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald/40 bg-emerald-soft font-mono text-xs text-emerald">
              4.8
            </div>
          </div>
        </aside>
      </section>

      <section id="topics" className="space-y-4">
        <p className="label-caps text-ink-muted">Calibrated Topic Matrices</p>
        <div className="flex flex-wrap gap-2">
          {TOPIC_CLUSTERS.map((t) => (
            <span
              key={t.id}
              className="label-caps rounded-full border border-surface-high bg-surface px-3 py-1.5 text-ink-secondary"
            >
              {t.title}{" "}
              <span className="text-ink-muted">{`// ${t.weight} WT`}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="panel p-5">
            <p className="label-caps text-ink-muted">{m.label}</p>
            <p className="mt-3 font-mono text-3xl tracking-tight text-ink">
              {m.value}
            </p>
            <p className="mt-2 text-sm text-ink-secondary">{m.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
