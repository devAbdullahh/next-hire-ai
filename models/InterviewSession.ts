import mongoose, { Schema, type Model } from "mongoose";
import type {
  AnswerLength,
  AnswerScore,
  AnswerTone,
  Difficulty,
  InterviewMessage,
  SessionStatus,
} from "@/types";

export interface IInterviewSession {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobDescriptionId?: mongoose.Types.ObjectId;
  jobTitle?: string;
  jobDescriptionText?: string;
  answerLength?: AnswerLength;
  answerTone?: AnswerTone;
  maxQuestions?: number;
  interviewerAvatarId?: string;
  messages: InterviewMessage[];
  scores: AnswerScore[];
  currentDifficulty: Difficulty;
  status: SessionStatus;
  report?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ["ai", "user"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ScoreSchema = new Schema(
  {
    score: { type: Number, required: true },
    technicalCorrectness: { type: Number, required: true },
    depth: { type: Number, required: true },
    clarity: { type: Number, required: true },
    confidence: { type: Number, required: true },
    justification: { type: String, required: true },
    questionIndex: { type: Number, required: true },
  },
  { _id: false }
);

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescriptionId: { type: Schema.Types.ObjectId, ref: "JobDescription" },
    jobTitle: { type: String },
    jobDescriptionText: { type: String },
    answerLength: {
      type: String,
      enum: ["short", "medium", "long"],
      default: "medium",
    },
    answerTone: {
      type: String,
      enum: ["professional", "conversational", "technical", "friendly"],
      default: "professional",
    },
    maxQuestions: { type: Number, default: 8, min: 1, max: 15 },
    interviewerAvatarId: { type: String, default: "monica" },
    messages: { type: [MessageSchema], default: [] },
    scores: { type: [ScoreSchema], default: [] },
    currentDifficulty: {
      type: String,
      enum: ["junior", "mid", "senior"],
      default: "junior",
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    report: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

if (mongoose.models.InterviewSession) {
  mongoose.deleteModel("InterviewSession");
}

export const InterviewSession: Model<IInterviewSession> =
  mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
