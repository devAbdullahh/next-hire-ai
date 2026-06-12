import { chatCompletion } from "@/lib/groq";
import { GROQ_MODELS } from "@/lib/constants";
import type { AnswerScore, Difficulty, InterviewConfig } from "@/types";
import {
  buildEvaluatorSystemPrompt,
  buildEvaluatorUserPrompt,
} from "./prompts/evaluator";

export async function evaluateAnswer(
  question: string,
  answer: string,
  resumeSnippet: string,
  questionIndex: number,
  jobDescriptionSnippet?: string,
  interviewConfig?: InterviewConfig
): Promise<AnswerScore> {
  const hasJob = !!jobDescriptionSnippet?.trim();

  const content = await chatCompletion(
    [
      {
        role: "system",
        content: buildEvaluatorSystemPrompt(hasJob, interviewConfig),
      },
      {
        role: "user",
        content: buildEvaluatorUserPrompt(
          question,
          answer,
          resumeSnippet,
          jobDescriptionSnippet
        ),
      },
    ],
    {
      model: GROQ_MODELS.fast,
      temperature: 0.2,
      jsonMode: true,
    }
  );

  const parsed = JSON.parse(content) as Omit<AnswerScore, "questionIndex">;

  return {
    score: clamp(parsed.score ?? 0),
    technicalCorrectness: clamp(parsed.technicalCorrectness ?? 0),
    depth: clamp(parsed.depth ?? 0),
    clarity: clamp(parsed.clarity ?? 0),
    confidence: clamp(parsed.confidence ?? 0),
    justification: parsed.justification ?? "No justification provided.",
    questionIndex,
  };
}

export function adjustDifficulty(
  current: Difficulty,
  recentScores: number[]
): Difficulty {
  if (recentScores.length === 0) return current;

  const avg =
    recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

  const order: Difficulty[] = ["junior", "mid", "senior"];
  const idx = order.indexOf(current);

  if (avg >= 7.5 && idx < order.length - 1) {
    return order[idx + 1];
  }
  if (avg <= 4 && idx > 0) {
    return order[idx - 1];
  }
  return current;
}

function clamp(n: number): number {
  return Math.min(10, Math.max(0, Number(n) || 0));
}
