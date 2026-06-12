export type Difficulty = "junior" | "mid" | "senior";

export type InterviewerAvatarId =
  | "monica"
  | "marcus"
  | "elena"
  | "james"
  | "priya";

export interface InterviewerAvatar {
  id: InterviewerAvatarId;
  name: string;
  imageSrc: string;
  role: string;
  tagline: string;
  traits: string[];
  personality: string;
  theme: {
    initials: string;
    gradient: string;
    ring: string;
    glow: string;
  };
  sampleLine: string;
}
export type AnswerLength = "short" | "medium" | "long";
export type AnswerTone = "professional" | "conversational" | "technical" | "friendly";

export interface InterviewConfig {
  answerLength: AnswerLength;
  answerTone: AnswerTone;
  questionCount: number;
}
export type SessionStatus = "active" | "completed";
export type MessageRole = "ai" | "user";

export interface InterviewMessage {
  role: MessageRole;
  content: string;
  createdAt?: Date;
}

export interface AnswerScore {
  score: number;
  technicalCorrectness: number;
  depth: number;
  clarity: number;
  confidence: number;
  justification: string;
  questionIndex: number;
}

export interface ResumeStructured {
  skills: string[];
  experience: string[];
  projects: string[];
  rawText: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface InterviewReport {
  summary: string;
  overallScore: number;
  strengths: string[];
  weakAreas: string[];
  improvementRoadmap: string[];
  detailedFeedback: string;
  jobFitScore?: number;
  jobFitSummary?: string;
  roleGaps?: string[];
  roleStrengths?: string[];
}

export interface JobDescriptionItem {
  id: string;
  title: string;
  company: string;
  rawText: string;
  createdAt: string | Date;
}
