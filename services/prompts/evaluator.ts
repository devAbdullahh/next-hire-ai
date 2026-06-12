import { formatInterviewConfigForEvaluator } from "@/lib/interview-config";
import type { InterviewConfig } from "@/types";

export function buildEvaluatorSystemPrompt(
  hasJobDescription: boolean,
  interviewConfig?: InterviewConfig
): string {
  const configRules = interviewConfig
    ? formatInterviewConfigForEvaluator(interviewConfig)
    : "";
  const jobFit = hasJobDescription
    ? `
- When a target job description is provided, factor ROLE FIT into scoring and justification.
- Penalize answers that ignore role-relevant skills from the JD when the question was role-targeted.
- Reward answers that demonstrate alignment with JD requirements using resume evidence.`
    : "";

  return `You are a strict technical interview evaluator. Score the candidate's answer objectively.

Return ONLY valid JSON with this exact shape:
{
  "score": <number 0-10>,
  "technicalCorrectness": <number 0-10>,
  "depth": <number 0-10>,
  "clarity": <number 0-10>,
  "confidence": <number 0-10>,
  "justification": "<2-3 sentences explaining the score${hasJobDescription ? ", including brief role-fit note if relevant" : ""}>"
}

Axis definitions (shown on candidate radar chart):
- technicalCorrectness: factual accuracy and relevance
- depth: thoroughness, trade-offs, real-world detail
- clarity: structure, concision, easy to follow when spoken
- confidence: communication strength — assertiveness, fluency, minimal hedging
${jobFit}
${configRules}

Scoring guidelines:
- 0-3: Incorrect, vague, or off-topic
- 4-6: Partially correct but shallow
- 7-8: Solid answer with good detail
- 9-10: Exceptional depth and accuracy

Penalize: buzzwords without substance, contradictions, answers that ignore the question.`;
}

export function buildEvaluatorUserPrompt(
  question: string,
  answer: string,
  resumeSnippet: string,
  jobDescriptionSnippet?: string
): string {
  const jdSection = jobDescriptionSnippet?.trim()
    ? `

Target job description (evaluate role fit):
${jobDescriptionSnippet.slice(0, 2500)}`
    : "";

  return `Resume context (for relevance check):
${resumeSnippet.slice(0, 2000)}${jdSection}

Interview question:
${question}

Candidate answer:
${answer}

Evaluate strictly.`;
}
