import type {
  EvaluationResult,
  GenerateRequest,
  QuestionBatch,
  Submission,
} from "./types";

const API_BASE = process.env.API_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      /* ignore */
    }
    throw new Error(`API ${res.status}: ${detail}`);
  }

  return res.json() as Promise<T>;
}

export async function generateQuestions(
  payload: GenerateRequest
): Promise<QuestionBatch> {
  return request<QuestionBatch>("/api/v1/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function evaluateSession(
  submissions: Submission[]
): Promise<EvaluationResult> {
  return request<EvaluationResult>("/api/v1/evaluate", {
    method: "POST",
    body: JSON.stringify({ submissions }),
  });
}

export { API_BASE as API_URL };
