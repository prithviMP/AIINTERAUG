import type { Difficulty } from "./types";

export interface TopicCluster {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  weight: number;
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: "DSA",
    code: "01",
    category: "CORE",
    title: "DSA & Algorithms",
    description:
      "Graph traversal, dynamic programming, amortized structures, and complexity proofs.",
    weight: 35,
  },
  {
    id: "System Design",
    code: "02",
    category: "ARCH",
    title: "High Level Design",
    description:
      "Distributed event brokers, CAP trade-offs, cache invalidation, multi-region HA.",
    weight: 25,
  },
  {
    id: "LLD",
    code: "03",
    category: "OOAD",
    title: "Low Level Design",
    description:
      "Class modeling, SOLID boundaries, extensible APIs, and pattern selection.",
    weight: 15,
  },
  {
    id: "Java",
    code: "04",
    category: "RUNTIME",
    title: "Java Internals",
    description:
      "JVM memory layout, ZGC pauses, concurrency primitives, and visibility rules.",
    weight: 20,
  },
  {
    id: "Spring Boot",
    code: "05",
    category: "MICRO",
    title: "Spring Cloud Architecture",
    description:
      "Boot auto-config, Data JPA fetch strategies, and service boundaries.",
    weight: 15,
  },
  {
    id: "Concurrency",
    code: "06",
    category: "SYNC",
    title: "Concurrency & Locks",
    description:
      "Lock contention, lock-free structures, barriers, and failure under load.",
    weight: 20,
  },
];

export const DIFFICULTY_LABELS: Record<
  Difficulty,
  { label: string; complexity: string; scale: string; probing: string }
> = {
  junior: {
    label: "Junior / Mid-Level",
    complexity: "O(N) Correctness First",
    scale: "10k QPS / Single Region",
    probing: "Guided Clarification",
  },
  senior: {
    label: "Senior Engineer",
    complexity: "O(log N) Space Optimal",
    scale: "10M QPS / Tier-1 HA",
    probing: "Adversarial Probing Active",
  },
  staff: {
    label: "Staff / Principal Architect",
    complexity: "Failure-Domain Optimal",
    scale: "Global Multi-Region",
    probing: "Deep Counter-Inquiry",
  },
};

export const QUESTION_COUNTS = [3, 5, 10] as const;
