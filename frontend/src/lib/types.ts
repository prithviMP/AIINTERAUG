export type Difficulty = "junior" | "senior" | "staff";

export type OptionId = "A" | "B" | "C" | "D";

export interface Option {
  id: OptionId;
  text: string;
}

export interface Question {
  id: number;
  topic: string;
  question: string;
  options: Option[];
  correct_option_id: OptionId;
  explanation: string;
  code_snippet?: string | null;
  code_language?: string | null;
}

export interface QuestionBatch {
  questions: Question[];
}

export interface GenerateRequest {
  topics: string[];
  count: number;
  difficulty?: Difficulty;
}

export interface Submission {
  topic: string;
  question: string;
  user_answer: string;
  correct_answer: string;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  areas_to_improve: string[];
  category_scores?: Record<string, number> | null;
}

export interface SessionConfig {
  topics: string[];
  difficulty: Difficulty;
  count: number;
}

export interface SessionAnswer {
  questionId: number;
  selected: OptionId;
}

export interface InterviewSession {
  config: SessionConfig;
  questions: Question[];
  answers: SessionAnswer[];
  evaluation?: EvaluationResult;
  startedAt: string;
}
