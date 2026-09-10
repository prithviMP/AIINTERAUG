# Product Requirements Document (PRD): COACH.AI

**Document Status:** Approved / Production Baseline  
**Target Milestone:** v1.0 Production Release  
**Domain:** Developer Tools / AI Technical Career Assessment  
**Author:** Lead Product Designer & Technical Architect  

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Technical interview preparation for senior, staff, and principal engineering roles (L5–L7+) remains fragmented and inefficient:
- **Low Signal Practice:** Traditional platforms rely on trivial LeetCode-style puzzles or scripted flashcards that fail to evaluate high-level system design, edge-case resilience, trade-off intuition, and communication cadence.
- **High Friction Human Mock Interviews:** Scheduling human peer mocks incurs high scheduling friction, inconsistent calibration standards, and lacks automated, deterministic telemetry.
- **Superficial Feedback:** Existing AI interview solutions often exhibit "sycophancy" (overly generous evaluations), hallucinate technical facts, or lack granular rubric alignment against top-tier tech standards (FAANG/Tier-1).

### 1.2 Product Vision
**COACH.AI** is a hyper-sophisticated, zero-distraction technical assessment engine designed to calibrate and elevate experienced software engineers against top-decile technical hiring bars. By pairing real-time scenario simulation, live code analysis, dynamic rubric scoring, and multimodal feedback with a terminal-inspired, minimal interface, COACH.AI provides realistic, high-pressure, and actionable technical interview practice.

---

## 2. Target Personas & User Profiles

| Persona | Target Level | Primary Goals | Core Pain Points |
| :--- | :--- | :--- | :--- |
| **Senior Engineer (L5)** | 4–7 YOE | Transitioning to Staff; validating distributed architecture concepts and failure domain recovery. | Needs structured critique on distributed systems trade-offs beyond basic algorithmic problem solving. |
| **Staff / Principal Architect (L6+)** | 8+ YOE | Refreshing interview agility; pressure-testing communication clarity and edge-case boundary analysis. | Existing tools cater to junior/mid-level leetcode problems rather than deep architectural trade-offs. |
| **Engineering Leader / Hiring Team** | Staff+ / Exec | Standardizing internal rubric definitions, onboarding benchmarks, and promotion readiness assessments. | Difficulty ensuring objective and calibrated interview loops across disparate hiring teams. |

---

## 3. Core Product Principles & Aesthetics

1. **Extreme Visual Restraint:** Dark Mode dominant (`#09090B` obsidian void canvas, `#121215` / `#18181B` matte containers, `#27272A` hairline borders). No neon glow blobs, generic AI gradients, or decorative clutter.
2. **Surgical Accent System:** Crisp Terminal Emerald (`#10B981`) reserved exclusively for live indicators, verified strengths, selected states, and performance metrics.
3. **High Density & Low Latency:** Monospace telemetry, real-time audio/code verification (<120ms latency target), and rapid keyboard-first navigation.
4. **Ruthless Technical Rigor:** Objective, adversarial probing on concurrency bottlenecks, CAP theorem trade-offs, cache invalidation, and data consistency models.

---

## 4. Feature Specifications & System Architecture

### 4.1 Module 1: Overview & Landing Experience (`/`)
- **Hero & Mission Statement:** Asymmetrical typographical layout establishing high-signal credibility.
- **Active Telemetry Stream:** Real-time indicator displaying runtime kernel status, active node allocation, and inquiry depth metrics.
- **Interactive Topic Matrix:** Discoverable pills highlighting calibrated topic clusters (DSA, Distributed Systems, Low Level Design, JVM Internals, Concurrency & Synchronization, Spring Cloud).
- **Core Action:** Prominent single-action trigger `"Start Interview Session →"`.

### 4.2 Module 2: Session Setup & Calibration Engine (`/setup`)
- **3-Phase Setup Flow:**
  1. *01 // Topic Vector:* Multi-select grid with weighted allocation (e.g., DSA 35%, High Level Design 25%, JVM 20%).
  2. *02 // Seniority Calibration:* Segmented target slider (Junior/Mid-Level, Senior Engineer, Staff/Principal Architect) dynamically adjusting counter-inquiry aggression and code rigor.
  3. *03 // Duration & Format:* Selection of question volume (5 to 15 questions) and delivery mode (MCQ, Textual Explanation, Multi-modal Real-time Voice).
- **Sticky Configuration Dock:** Dynamic summary drawer displaying real-time session parameters with instant verification.

### 4.3 Module 3: Clean Focus Interview Room (`/interview`)
- **Distraction-Free Chrome:** Micro-progress indicator bar, monospace countdown timer, and category indicator.
- **Interactive Technical Viewport:** Rich syntax-highlighted code viewport (Go, Java, Rust, Python, TypeScript) contextualizing real-world production incidents or architectural specs.
- **Adaptive Response Deck:**
  - *Multiple Choice Cards (MCQ):* High-contrast option cards with hotkey selection (`[A]`, `[B]`, `[C]`, `[D]`).
  - *Text Explanation & Voice Synthesis:* Segmented response selector allowing engineers to explain rationale via text or low-latency AST-verified voice audio.
- **Real-Time Proctor Evaluation:** Live telemetry widget monitoring structural coherence, concurrency rigor, and response latency.

### 4.4 Module 4: Scorecard & Performance Synthesis (`/results`)
- **Hero Metric Aggregate:** Benchmark index (0–100) benchmarked against Tier-1 global engineering percentiles with calibration confidence ratings.
- **Diagnostic Breakdown:**
  - *Validated Strengths:* Identified core proficiencies with question citations and mastery scores.
  - *Areas to Refine:* Prioritized critical failure vectors (e.g., network partition edge cases, JVM pause latencies).
- **System Topology & Trace Analysis:** Visual topology map illustrating execution bottlenecks, peak throughput, and fault recovery.
- **Granular Review Accordion:** Question-by-question breakdown featuring candidate proposal vs. optimal architectural rationale, accompanied by code refactoring snippets.
- **Action Suite:** Quick retake trigger and comprehensive PDF/JSON telemetry export.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Performance & Latency
- **Inference Latency:** Median end-to-end token inference under 240ms; voice synthesis latency under 120ms.
- **Core Web Vitals:** First Contentful Paint (FCP) < 0.6s, Largest Contentful Paint (LCP) < 1.1s, Cumulative Layout Shift (CLS) = 0.
- **High Availability:** 99.98% SLO uptime with graceful offline fallback caching.

### 5.2 Security & Privacy
- **Zero Retention on Code Sandboxes:** Candidate code submissions evaluated in isolated, ephemeral sandboxes terminated upon session close.
- **End-to-End Encryption:** Audio streams and candidate rationale encrypted in transit (TLS 1.3) and at rest (AES-256).

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

1. **Candidate Assessment Completion Rate:** ≥ 84% of initiated interview sessions completed to the scorecard phase.
2. **Scorecard Retake Engagement:** ≥ 45% of users retaking a targeted deficit session within 48 hours.
3. **Calibration Realism Score:** User feedback rating ≥ 4.8 / 5.0 on benchmark realism compared to live FAANG/Tier-1 Staff+ loops.
4. **Time to Value:** Candidate configured and active inside a question scenario within 30 seconds of onboarding.

---

## 7. Future Roadmap & Horizon 2 Capabilities
- **Phase 1.1:** Real-time collaborative whiteboarding canvas with dynamic AST linting for distributed system diagrams.
- **Phase 1.2:** Team/Enterprise portal allowing VP/Staff Eng loop leads to calibrate customized company question vectors and hiring rubrics.
- **Phase 1.3:** Integration with IDE extensions (VS Code / JetBrains) for local coding assessment integration.
