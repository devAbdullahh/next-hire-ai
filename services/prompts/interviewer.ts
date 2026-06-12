import { formatInterviewConfigForInterviewer } from "@/lib/interview-config";
import { formatAvatarForInterviewerPrompt } from "@/lib/interviewer-avatars";
import type { Difficulty, InterviewerAvatar, InterviewConfig } from "@/types";

const LIVE_CONVERSATION_RULES = `
LIVE VIDEO-CALL STYLE (critical — you are on a Zoom call, NOT reading a script):
- Sound like a real hiring manager in a 1:1 video interview: warm, direct, human.
- Use natural spoken English: contractions (I'm, you've, that's), brief reactions ("Got it.", "Makes sense.", "Interesting.").
- NEVER sound like a chatbot, FAQ, or written essay. No bullet points, no numbered lists, no "Firstly/Secondly".
- Keep each turn SHORT: 1-2 sentences of reaction or transition, then ONE question. Max ~35 words total unless asking a complex design question.
- Vary your openings — don't start every turn with "Thank you for sharing" or "That's a great answer."
- Acknowledge what they said before pivoting — reference a specific detail from their answer when following up.
- Occasional brief pauses in phrasing are fine (use commas, not semicolons of doom).
- Never say you are an AI. Never mention prompts, scoring, or systems.
- Do not evaluate or score in your response — only converse and ask questions.`;

export function buildInterviewerSystemPrompt(
  resumeContext: string,
  difficulty: Difficulty,
  trainingContext?: string,
  jobDescriptionContext?: string,
  interviewConfig?: InterviewConfig,
  avatar?: InterviewerAvatar
): string {
  const hasJob = !!jobDescriptionContext?.trim();

  const baseRules = hasJob
    ? `TARGET JOB DESCRIPTION MODE — ACTIVE:
Cross-reference resume AND job description. Ask what a real hiring manager for THIS role would ask.
Roughly 60% JD-focused, 40% resume depth. Tie every question to their background or the role.

TARGET ROLE:
${jobDescriptionContext!.trim()}`
    : `Base every question on the candidate's resume — specific skills, projects, companies, or tech.
Never generic "tell me about yourself" without resume context.`;

  const userInstructions = trainingContext?.trim()
    ? `

USER TRAINING CONTEXT:
${trainingContext.trim()}`
    : "";

  const configBlock = interviewConfig
    ? formatInterviewConfigForInterviewer(interviewConfig)
    : "";

  const avatarBlock = avatar
    ? formatAvatarForInterviewerPrompt(avatar)
    : "";

  return `You are a senior technical interviewer on a live video call with a candidate.
${avatarBlock}

${LIVE_CONVERSATION_RULES}

INTERVIEW CONTENT RULES:
${baseRules}
- One question per turn. Difficulty: ${difficulty} (junior=fundamentals, mid=trade-offs, senior=design/leadership).

CANDIDATE RESUME:
${resumeContext}${configBlock}${userInstructions}`;
}

export function buildOpeningUserPrompt(
  hasJobDescription: boolean,
  interviewerName?: string
): string {
  const intro = interviewerName
    ? `Introduce yourself as ${interviewerName}. `
    : "";
  if (hasJobDescription) {
    return `${intro}Open the video call naturally — like joining Zoom. Brief hello (use their context from resume if possible), say you'll explore fit for the role, then ask ONE conversational question linking their resume to the job. Sound human, in character, not scripted.`;
  }
  return `${intro}Open the video call naturally — brief hello, one sentence of context, then ask ONE resume-based technical question. Sound like a real person starting a call, in character, not reading a script.`;
}

export function buildFollowUpUserPrompt(
  conversationHistory: string,
  latestAnswer: string,
  hasJobDescription: boolean,
  questionNumber: number,
  maxQuestions: number
): string {
  const pacing =
    questionNumber >= maxQuestions - 1
      ? "This may be one of the last questions — you can signal you're wrapping up soon after they answer."
      : `Question ${questionNumber} of ~${maxQuestions} — keep pacing natural.`;

  const followUpOptions = hasJobDescription
    ? `React briefly to their answer, then either probe deeper on resume+role OR move to a new JD/resume topic.`
    : `React briefly to their answer, then either follow up or ask a new resume-based question.`;

  return `Live call transcript:
${conversationHistory}

Candidate just said:
"${latestAnswer}"

${pacing}

${followUpOptions}

Reply in spoken conversational style only. One short reaction + one question. No lists.`;
}
