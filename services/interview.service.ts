import { chatCompletion } from "@/lib/groq";
import { connectDB } from "@/lib/mongodb";
import { DEFAULT_INTERVIEW_QUESTIONS } from "@/lib/constants";
import { InterviewSession, type IInterviewSession } from "@/models/InterviewSession";
import type { AnswerScore, Difficulty, InterviewConfig } from "@/types";
import mongoose from "mongoose";
import { evaluateAnswer, adjustDifficulty } from "./evaluation.service";
import {
  buildInterviewerSystemPrompt,
  buildOpeningUserPrompt,
  buildFollowUpUserPrompt,
} from "./prompts/interviewer";
import { formatResumeForPrompt, getResumeById } from "./resume.service";
import { clampQuestionCount } from "@/lib/normalize-interview-config";
import {
  DEFAULT_INTERVIEWER_AVATAR_ID,
  getInterviewerAvatar,
  isValidAvatarId,
} from "@/lib/interviewer-avatars";
import { getTrainingContext, getInterviewConfig } from "./settings.service";
import {
  formatJobDescriptionForPrompt,
  formatJobDescriptionLabel,
  getJobDescriptionById,
} from "./job-description.service";

function formatConversation(messages: IInterviewSession["messages"]): string {
  return messages
    .map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n");
}

function getLastAiQuestion(messages: IInterviewSession["messages"]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "ai") return messages[i].content;
  }
  return "";
}

function sessionToInterviewConfig(session: IInterviewSession): InterviewConfig {
  return {
    answerLength: session.answerLength ?? "medium",
    answerTone: session.answerTone ?? "professional",
    questionCount: session.maxQuestions ?? DEFAULT_INTERVIEW_QUESTIONS,
  };
}

export interface StartInterviewOptions {
  jobDescriptionId?: string;
  questionCount?: number;
  answerLength?: InterviewConfig["answerLength"];
  answerTone?: InterviewConfig["answerTone"];
  avatarId?: string;
}

export async function createInterviewSession(
  userId: string,
  resumeId: string,
  options?: StartInterviewOptions
): Promise<{ session: IInterviewSession; openingMessage: string }> {
  await connectDB();

  const resume = await getResumeById(resumeId, userId);
  if (!resume) {
    throw new Error("Resume not found");
  }

  const userConfig = await getInterviewConfig(userId);
  const interviewConfig: InterviewConfig = {
    answerLength: options?.answerLength ?? userConfig.answerLength,
    answerTone: options?.answerTone ?? userConfig.answerTone,
    questionCount: clampQuestionCount(
      options?.questionCount ?? userConfig.questionCount
    ),
  };

  let jobDescriptionText: string | undefined;
  let jobTitle: string | undefined;
  let jobDescriptionObjectId: mongoose.Types.ObjectId | undefined;

  if (options?.jobDescriptionId) {
    const jd = await getJobDescriptionById(options.jobDescriptionId, userId);
    if (!jd) {
      throw new Error("Job description not found");
    }
    jobDescriptionText = formatJobDescriptionForPrompt(jd);
    jobTitle = formatJobDescriptionLabel(jd);
    jobDescriptionObjectId = jd._id;
  }

  const resumeContext = formatResumeForPrompt(resume);
  const trainingContext = await getTrainingContext(userId);
  const avatarId =
    options?.avatarId && isValidAvatarId(options.avatarId)
      ? options.avatarId
      : DEFAULT_INTERVIEWER_AVATAR_ID;
  const avatar = getInterviewerAvatar(avatarId);
  const difficulty: Difficulty = "junior";
  const hasJob = !!jobDescriptionText;

  const openingMessage = await chatCompletion(
    [
      {
        role: "system",
        content: buildInterviewerSystemPrompt(
          resumeContext,
          difficulty,
          trainingContext,
          jobDescriptionText,
          interviewConfig,
          avatar
        ),
      },
      { role: "user", content: buildOpeningUserPrompt(hasJob, avatar.name) },
    ],
    { temperature: 0.88 }
  );

  const session = await InterviewSession.create({
    userId: new mongoose.Types.ObjectId(userId),
    resumeId: new mongoose.Types.ObjectId(resumeId),
    ...(jobDescriptionObjectId && {
      jobDescriptionId: jobDescriptionObjectId,
      jobTitle,
      jobDescriptionText,
    }),
    answerLength: interviewConfig.answerLength,
    answerTone: interviewConfig.answerTone,
    maxQuestions: interviewConfig.questionCount,
    interviewerAvatarId: avatarId,
    messages: [
      { role: "ai", content: openingMessage, createdAt: new Date() },
    ],
    scores: [],
    currentDifficulty: difficulty,
    status: "active",
  });

  return { session, openingMessage };
}

export async function processUserAnswer(
  sessionId: string,
  userId: string,
  userAnswer: string
): Promise<{
  session: IInterviewSession;
  aiResponse: string;
  latestScore: AnswerScore | null;
  isComplete: boolean;
}> {
  await connectDB();

  const session = await InterviewSession.findOne({
    _id: new mongoose.Types.ObjectId(sessionId),
    userId: new mongoose.Types.ObjectId(userId),
    status: "active",
  });

  if (!session) {
    throw new Error("Active session not found");
  }

  const resume = await getResumeById(session.resumeId.toString(), userId);
  if (!resume) {
    throw new Error("Resume not found");
  }

  session.messages.push({
    role: "user",
    content: userAnswer,
    createdAt: new Date(),
  });

  const question = getLastAiQuestion(session.messages);
  const questionIndex = session.scores.length;
  const hasJob = !!session.jobDescriptionText?.trim();
  const interviewConfig = sessionToInterviewConfig(session);

  const latestScore = await evaluateAnswer(
    question,
    userAnswer,
    resume.rawText,
    questionIndex,
    session.jobDescriptionText,
    interviewConfig
  );

  session.scores.push(latestScore);

  const recentScores = session.scores.slice(-3).map((s) => s.score);
  session.currentDifficulty = adjustDifficulty(
    session.currentDifficulty,
    recentScores
  );

  const userTurnCount = session.messages.filter((m) => m.role === "user").length;
  const maxQuestions = session.maxQuestions ?? interviewConfig.questionCount;
  const isComplete = userTurnCount >= maxQuestions;

  let aiResponse: string;

  if (isComplete) {
    aiResponse = hasJob
      ? "Alright, that's all I've got for today — really appreciate you walking me through your background against this role. I'll put together your feedback and role-fit summary; you'll see the full report on your dashboard shortly."
      : "Great, I think that covers what I needed — thanks for your time today. I'll pull together your feedback and you'll see the full report on your dashboard in a moment.";
    session.messages.push({ role: "ai", content: aiResponse, createdAt: new Date() });
    session.status = "completed";
    await session.save();
    return { session, aiResponse, latestScore, isComplete: true };
  }

  const resumeContext = formatResumeForPrompt(resume);
  const trainingContext = await getTrainingContext(userId);
  const avatar = getInterviewerAvatar(session.interviewerAvatarId);
  const history = formatConversation(session.messages);

  aiResponse = await chatCompletion(
    [
      {
        role: "system",
        content: buildInterviewerSystemPrompt(
          resumeContext,
          session.currentDifficulty,
          trainingContext,
          session.jobDescriptionText,
          interviewConfig,
          avatar
        ),
      },
      {
        role: "user",
        content: buildFollowUpUserPrompt(
          history,
          userAnswer,
          hasJob,
          userTurnCount,
          maxQuestions
        ),
      },
    ],
    { temperature: 0.85 }
  );

  session.messages.push({ role: "ai", content: aiResponse, createdAt: new Date() });
  await session.save();

  return { session, aiResponse, latestScore, isComplete: false };
}

export async function getSession(
  sessionId: string,
  userId: string
): Promise<IInterviewSession | null> {
  await connectDB();
  return InterviewSession.findOne({
    _id: new mongoose.Types.ObjectId(sessionId),
    userId: new mongoose.Types.ObjectId(userId),
  });
}

export async function listSessions(userId: string): Promise<IInterviewSession[]> {
  await connectDB();
  return InterviewSession.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ updatedAt: -1 })
    .limit(100);
}
