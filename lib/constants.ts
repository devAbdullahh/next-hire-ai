export const APP_NAME = "NextHire AI";
export const APP_LOGO_INITIAL = "N";
export const APP_LOGO_SRC = "/nexthire-logo.png";

export const GROQ_MODELS = {
  primary: "llama-3.3-70b-versatile",
  fast: "llama-3.1-8b-instant",
} as const;

export const GROQ_TTS_MODEL = "canopylabs/orpheus-v1-english" as const;

export const JWT_COOKIE_NAME = "assistio_token";
export const JWT_EXPIRY = "7d";

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MIN_INTERVIEW_QUESTIONS = 1;
export const MAX_INTERVIEW_QUESTIONS = 15;
export const DEFAULT_INTERVIEW_QUESTIONS = 8;
/** @deprecated Use per-session maxQuestions */
export const MAX_INTERVIEW_TURNS = DEFAULT_INTERVIEW_QUESTIONS;
export const MAX_TRAINING_CONTEXT_LENGTH = 2000;
export const MAX_JOB_DESCRIPTION_LENGTH = 8000;
