import { connectDB } from "@/lib/mongodb";
import { MAX_TRAINING_CONTEXT_LENGTH, DEFAULT_INTERVIEW_QUESTIONS } from "@/lib/constants";
import { clampQuestionCount } from "@/lib/normalize-interview-config";
import {
  DEFAULT_INTERVIEWER_AVATAR_ID,
  getInterviewerAvatar,
  isValidAvatarId,
} from "@/lib/interviewer-avatars";
import { User } from "@/models/User";
import type {
  AnswerLength,
  AnswerTone,
  InterviewerAvatarId,
  InterviewConfig,
} from "@/types";
import mongoose from "mongoose";

export async function getTrainingContext(userId: string): Promise<string> {
  await connectDB();
  const user = await User.findById(new mongoose.Types.ObjectId(userId)).select(
    "trainingContext"
  );
  return user?.trainingContext?.trim() ?? "";
}

export async function updateTrainingContext(
  userId: string,
  trainingContext: string
): Promise<string> {
  await connectDB();

  const trimmed = trainingContext.trim();
  if (trimmed.length > MAX_TRAINING_CONTEXT_LENGTH) {
    throw new Error(
      `Training context must be under ${MAX_TRAINING_CONTEXT_LENGTH} characters`
    );
  }

  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    { trainingContext: trimmed },
    { new: true }
  ).select("trainingContext");

  if (!user) {
    throw new Error("User not found");
  }

  return user.trainingContext;
}

export async function getInterviewConfig(userId: string): Promise<InterviewConfig> {
  await connectDB();
  const user = await User.findById(new mongoose.Types.ObjectId(userId)).select(
    "answerLength answerTone defaultQuestionCount"
  );

  const questionCount =
    typeof user?.defaultQuestionCount === "number"
      ? user.defaultQuestionCount
      : DEFAULT_INTERVIEW_QUESTIONS;

  return {
    answerLength: (user?.answerLength as AnswerLength) ?? "medium",
    answerTone: (user?.answerTone as AnswerTone) ?? "professional",
    questionCount: clampQuestionCount(questionCount),
  };
}

export async function updateInterviewConfig(
  userId: string,
  config: InterviewConfig
): Promise<InterviewConfig> {
  await connectDB();

  const questionCount = clampQuestionCount(config.questionCount);

  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    {
      $set: {
        answerLength: config.answerLength,
        answerTone: config.answerTone,
        defaultQuestionCount: questionCount,
      },
    },
    { new: true, runValidators: true }
  ).select("answerLength answerTone defaultQuestionCount");

  if (!user) {
    throw new Error("User not found");
  }

  const savedCount =
    typeof user.defaultQuestionCount === "number"
      ? user.defaultQuestionCount
      : questionCount;

  return {
    answerLength: (user.answerLength as AnswerLength) ?? config.answerLength,
    answerTone: (user.answerTone as AnswerTone) ?? config.answerTone,
    questionCount: clampQuestionCount(savedCount),
  };
}

export async function getInterviewerAvatarId(
  userId: string
): Promise<InterviewerAvatarId> {
  await connectDB();
  const user = await User.findById(new mongoose.Types.ObjectId(userId)).select(
    "interviewerAvatarId"
  );
  const id = user?.interviewerAvatarId;
  return id && isValidAvatarId(id) ? id : DEFAULT_INTERVIEWER_AVATAR_ID;
}

export async function updateInterviewerAvatarId(
  userId: string,
  avatarId: string
): Promise<InterviewerAvatarId> {
  if (!isValidAvatarId(avatarId)) {
    throw new Error("Invalid interviewer avatar");
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    { $set: { interviewerAvatarId: avatarId } },
    { new: true, runValidators: true }
  ).select("interviewerAvatarId");

  if (!user) {
    throw new Error("User not found");
  }

  const saved = user.interviewerAvatarId;
  return isValidAvatarId(saved) ? saved : DEFAULT_INTERVIEWER_AVATAR_ID;
}

export async function getInterviewerAvatarForUser(userId: string) {
  const id = await getInterviewerAvatarId(userId);
  return getInterviewerAvatar(id);
}
