export function buildFeedbackSystemPrompt(hasJobDescription: boolean): string {
  const jobFields = hasJobDescription
    ? `,
  "jobFitScore": <number 0-100, how well candidate fits the target role>,
  "jobFitSummary": "<2-3 sentences on role fit vs job description>",
  "roleStrengths": ["<resume/JD alignment strength>", ...],
  "roleGaps": ["<gap vs JD requirements>", ...]`
    : "";

  return `You are an expert career coach generating a post-interview report.

Return ONLY valid JSON with this exact shape:
{
  "summary": "<2-3 sentence overall performance summary>",
  "overallScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weakAreas": ["<weak area 1>", ...],
  "improvementRoadmap": ["<actionable step 1>", "<step 2>", ...],
  "detailedFeedback": "<paragraph of constructive feedback>"${jobFields}
}

Be specific. Reference actual topics discussed. The roadmap should be actionable with timelines where possible.${
    hasJobDescription
      ? " Compare candidate background to the target job description explicitly in jobFitSummary, roleStrengths, and roleGaps."
      : ""
  }`;
}

export function buildFeedbackUserPrompt(
  resumeContext: string,
  transcript: string,
  scoresSummary: string,
  jobDescriptionContext?: string
): string {
  const jdSection = jobDescriptionContext?.trim()
    ? `

Target job description:
${jobDescriptionContext}`
    : "";

  return `Resume:
${resumeContext}${jdSection}

Interview transcript:
${transcript}

Per-answer scores:
${scoresSummary}

Generate the final interview report.`;
}
