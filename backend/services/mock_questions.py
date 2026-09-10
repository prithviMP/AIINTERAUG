"""Static question bank used when Gemini is unavailable."""

from __future__ import annotations

import hashlib
from typing import List

from schemas import Difficulty, Option, Question, QuestionBatch

QUESTION_BANK: List[Question] = [
    Question(
        id=1,
        topic="DSA",
        question="Which data structure gives amortized O(1) insert and O(1) average lookup for unique keys?",
        options=[
            Option(id="A", text="Balanced BST"),
            Option(id="B", text="Hash table"),
            Option(id="C", text="Linked list"),
            Option(id="D", text="Priority queue"),
        ],
        correct_option_id="B",
        explanation="Hash tables provide amortized O(1) insert and average O(1) lookup for unique keys.",
    ),
    Question(
        id=2,
        topic="DSA",
        question="For Dijkstra on a sparse graph with a binary heap, what is the typical time complexity?",
        options=[
            Option(id="A", text="O(V + E)"),
            Option(id="B", text="O(V^2)"),
            Option(id="C", text="O((V + E) log V)"),
            Option(id="D", text="O(E log E)"),
        ],
        correct_option_id="C",
        explanation="Binary-heap Dijkstra is O((V + E) log V) due to decrease-key / extract-min heap operations.",
    ),
    Question(
        id=3,
        topic="System Design",
        question="In a write-behind cache invalidation strategy under replica lag, which approach best preserves read-your-writes?",
        options=[
            Option(id="A", text="Always read from any replica immediately"),
            Option(id="B", text="Sticky session to primary until lag clears, plus versioned keys"),
            Option(id="C", text="Disable caching entirely"),
            Option(id="D", text="Increase TTL only"),
        ],
        correct_option_id="B",
        explanation="Routing recent writers to primary with versioned keys avoids stale replica reads after writes.",
        code_snippet=(
            "func CommitTransactionWithCDC(tx Tx, key string) error {\n"
            "  if err := tx.Commit(); err != nil { return err }\n"
            "  return publishInvalidate(key, SHA256V2(tx.Version))\n"
            "}"
        ),
        code_language="go",
    ),
    Question(
        id=4,
        topic="System Design",
        question="Which CAP trade-off best describes a multi-region shopping cart that prefers availability during partitions?",
        options=[
            Option(id="A", text="CP with synchronous quorum writes"),
            Option(id="B", text="AP with conflict resolution on merge"),
            Option(id="C", text="CA with a single leader forever"),
            Option(id="D", text="Strict serializability globally"),
        ],
        correct_option_id="B",
        explanation="AP systems stay available under partition and reconcile conflicts later (e.g., CRDTs / last-writer-wins).",
    ),
    Question(
        id=5,
        topic="LLD",
        question="Which pattern best decouples notification channels (email, SMS, push) from order domain events?",
        options=[
            Option(id="A", text="Singleton"),
            Option(id="B", text="Observer / Pub-Sub"),
            Option(id="C", text="Adapter only"),
            Option(id="D", text="Prototype"),
        ],
        correct_option_id="B",
        explanation="Observer/pub-sub lets domain events fan out to independent notification subscribers.",
    ),
    Question(
        id=6,
        topic="LLD",
        question="For a rate limiter shared across instances, which design is most appropriate?",
        options=[
            Option(id="A", text="In-process HashMap only"),
            Option(id="B", text="Token bucket backed by Redis with Lua atomicity"),
            Option(id="C", text="ThreadLocal counters"),
            Option(id="D", text="Static mutable int"),
        ],
        correct_option_id="B",
        explanation="Cross-instance limiting needs a shared store; Redis + Lua keeps increments atomic.",
    ),
    Question(
        id=7,
        topic="Java",
        question="Which JVM memory area is shared among all threads?",
        options=[
            Option(id="A", text="Program Counter Register"),
            Option(id="B", text="JVM Stack"),
            Option(id="C", text="Heap Area"),
            Option(id="D", text="Native Method Stack"),
        ],
        correct_option_id="C",
        explanation="The Heap (and Method Area/Metaspace) are shared across threads; stacks and PCs are per-thread.",
    ),
    Question(
        id=8,
        topic="Java",
        question="What does the `volatile` keyword primarily guarantee in Java?",
        options=[
            Option(id="A", text="Atomic compound operations like i++"),
            Option(id="B", text="Visibility of writes across threads"),
            Option(id="C", text="Mutual exclusion for all methods"),
            Option(id="D", text="Prevention of deadlocks"),
        ],
        correct_option_id="B",
        explanation="volatile establishes a happens-before edge for reads/writes, ensuring visibility—not atomicity of compounds.",
    ),
    Question(
        id=9,
        topic="Spring Boot",
        question="Which annotation marks a Spring Boot application entry point that enables auto-configuration?",
        options=[
            Option(id="A", text="@EnableAutoConfiguration only"),
            Option(id="B", text="@SpringBootApplication"),
            Option(id="C", text="@ComponentScan only"),
            Option(id="D", text="@RestController"),
        ],
        correct_option_id="B",
        explanation="@SpringBootApplication composes @Configuration, @EnableAutoConfiguration, and @ComponentScan.",
    ),
    Question(
        id=10,
        topic="Spring Boot",
        question="In Spring Data JPA, which approach avoids the N+1 select problem most effectively?",
        options=[
            Option(id="A", text="Lazy loading everywhere"),
            Option(id="B", text="EntityGraph / JOIN FETCH for needed associations"),
            Option(id="C", text="Opening more sessions"),
            Option(id="D", text="Calling flush() more often"),
        ],
        correct_option_id="B",
        explanation="Fetch joins or entity graphs load associations in one query instead of per-entity selects.",
    ),
    Question(
        id=11,
        topic="Distributed Systems",
        question="In Raft, what happens after a leader fails and a majority elects a new leader?",
        options=[
            Option(id="A", text="Log entries from the old term may still be committed without majority"),
            Option(id="B", text="The new leader forces followers to match its log via AppendEntries"),
            Option(id="C", text="All uncommitted entries are discarded forever"),
            Option(id="D", text="Clients must reconnect to a fixed IP"),
        ],
        correct_option_id="B",
        explanation="The new leader replicates its log; conflicting follower entries are overwritten to converge.",
    ),
    Question(
        id=12,
        topic="Concurrency",
        question="Which construct best coordinates N workers completing before a barrier proceeds?",
        options=[
            Option(id="A", text="CountDownLatch / CyclicBarrier"),
            Option(id="B", text="Thread.sleep polling"),
            Option(id="C", text="System.gc()"),
            Option(id="D", text="Busy-wait on a boolean"),
        ],
        correct_option_id="A",
        explanation="Latches and barriers are designed for multi-thread rendezvous without busy waiting.",
    ),
]


TOPIC_ALIASES = {
    "DSA": ["DSA", "Data Structures", "Algorithms"],
    "System Design": ["System Design", "HLD", "High Level Design", "Distributed Systems"],
    "LLD": ["LLD", "Low Level Design", "OOAD"],
    "Java": ["Java", "Java Core", "JVM", "RUNTIME"],
    "Spring Boot": ["Spring", "Spring Boot", "MICRO"],
    "Distributed Systems": ["Distributed Systems", "DIST", "System Design"],
    "Concurrency": ["Concurrency", "Locks", "Concurrency & Locks"],
}


def _normalize_topic(topic: str) -> str:
    t = topic.strip().lower()
    for canonical, aliases in TOPIC_ALIASES.items():
        if any(a.lower() in t or t in a.lower() for a in aliases) or t == canonical.lower():
            return canonical
    return topic


def get_mock_questions(
    topics: List[str],
    count: int,
    difficulty: Difficulty = "senior",
) -> QuestionBatch:
    normalized = {_normalize_topic(t) for t in topics}
    filtered = [q for q in QUESTION_BANK if _normalize_topic(q.topic) in normalized]
    if not filtered:
        filtered = list(QUESTION_BANK)

    # Deterministic shuffle keyed by topics+difficulty for stable demos
    seed = hashlib.sha256(f"{sorted(normalized)}:{difficulty}".encode()).hexdigest()
    ranked = sorted(
        filtered,
        key=lambda q: hashlib.sha256(f"{seed}:{q.id}".encode()).hexdigest(),
    )
    selected = (ranked * ((count // len(ranked)) + 1))[:count]
    questions = []
    for idx, q in enumerate(selected, start=1):
        questions.append(q.model_copy(update={"id": idx}))
    return QuestionBatch(questions=questions)
