import type { InterviewSession } from "./types";

const KEY = "coach.ai.session.v1";

export function saveSession(session: InterviewSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): InterviewSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InterviewSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function updateSession(
  updater: (prev: InterviewSession) => InterviewSession
): InterviewSession | null {
  const current = loadSession();
  if (!current) return null;
  const next = updater(current);
  saveSession(next);
  return next;
}
