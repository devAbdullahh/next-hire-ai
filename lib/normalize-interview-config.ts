import {
  DEFAULT_INTERVIEW_QUESTIONS,
  MIN_INTERVIEW_QUESTIONS,
  MAX_INTERVIEW_QUESTIONS,
} from "@/lib/constants";
import type { AnswerLength, AnswerTone, InterviewConfig } from "@/types";

export function clampQuestionCount(count: number): number {
  return Math.min(
    MAX_INTERVIEW_QUESTIONS,
    Math.max(MIN_INTERVIEW_QUESTIONS, Math.round(count) || DEFAULT_INTERVIEW_QUESTIONS)
  );
}

export function normalizeInterviewConfig(
  partial?: Partial<InterviewConfig> | null
): InterviewConfig {
  return {
    answerLength: (partial?.answerLength as AnswerLength) ?? "medium",
    answerTone: (partial?.answerTone as AnswerTone) ?? "professional",
    questionCount: clampQuestionCount(
      partial?.questionCount ?? DEFAULT_INTERVIEW_QUESTIONS
    ),
  };
}
