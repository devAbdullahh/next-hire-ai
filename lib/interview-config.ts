import type { AnswerLength, AnswerTone, InterviewConfig } from "@/types";

const LENGTH_GUIDANCE: Record<AnswerLength, string> = {
  short:
    "SHORT answers (~30–60 seconds spoken, roughly 2–4 sentences). Reward concision; penalize rambling or filler.",
  medium:
    "MEDIUM answers (~1–2 minutes spoken). Balanced detail — enough context without over-explaining.",
  long:
    "LONG answers (~2–3+ minutes spoken). Expect thorough explanations, examples, and trade-offs; penalize superficial brevity.",
};

const TONE_GUIDANCE: Record<AnswerTone, string> = {
  professional:
    "PROFESSIONAL tone — formal, structured, business-appropriate language. Penalize slang or overly casual phrasing.",
  conversational:
    "CONVERSATIONAL tone — natural and approachable while staying polished. Penalize stiff or robotic delivery.",
  technical:
    "TECHNICAL tone — precise terminology, engineer-to-engineer clarity. Penalize vague hand-waving without technical substance.",
  friendly:
    "FRIENDLY tone — warm, encouraging, personable. Penalize cold, dismissive, or overly terse responses.",
};

export function formatAnswerLengthGuidance(length: AnswerLength): string {
  return LENGTH_GUIDANCE[length];
}

export function formatAnswerToneGuidance(tone: AnswerTone): string {
  return TONE_GUIDANCE[tone];
}

export function formatInterviewConfigForInterviewer(config: InterviewConfig): string {
  return `
INTERVIEW CONFIGURATION (candidate preferences — tailor questions and expectations):
- Target answer length: ${config.answerLength.toUpperCase()} — ${LENGTH_GUIDANCE[config.answerLength].split(".")[0]}.
- Expected answer tone: ${config.answerTone.toUpperCase()} — ${TONE_GUIDANCE[config.answerTone].split(".")[0]}.
- Total questions planned: ${config.questionCount}. Pace the interview to cover this many distinct questions.`;
}

export function formatInterviewConfigForEvaluator(config: InterviewConfig): string {
  return `
CANDIDATE INTERVIEW CONFIG (score answers against these expectations):
- Answer length: ${formatAnswerLengthGuidance(config.answerLength)}
- Answer tone: ${formatAnswerToneGuidance(config.answerTone)}
- Adjust clarity and depth scores relative to the expected length. Mention length/tone fit in justification when relevant.`;
}

export const ANSWER_LENGTH_OPTIONS: { value: AnswerLength; label: string; hint: string }[] = [
  { value: "short", label: "Short", hint: "~30–60 sec, concise" },
  { value: "medium", label: "Medium", hint: "~1–2 min, balanced" },
  { value: "long", label: "Long", hint: "~2–3 min, detailed" },
];

export const ANSWER_TONE_OPTIONS: { value: AnswerTone; label: string; hint: string }[] = [
  { value: "professional", label: "Professional", hint: "Formal and structured" },
  { value: "conversational", label: "Conversational", hint: "Natural but polished" },
  { value: "technical", label: "Technical", hint: "Precise, engineer-to-engineer" },
  { value: "friendly", label: "Friendly", hint: "Warm and encouraging" },
];
