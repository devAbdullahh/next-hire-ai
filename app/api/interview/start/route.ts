import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import { createInterviewSession } from "@/services/interview.service";
import {
  MIN_INTERVIEW_QUESTIONS,
  MAX_INTERVIEW_QUESTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  resumeId: z.string().min(1),
  jobDescriptionId: z.string().min(1).optional(),
  avatarId: z.enum(["monica", "marcus", "elena", "james", "priya"]).optional(),
  answerLength: z.enum(["short", "medium", "long"]).optional(),
  answerTone: z
    .enum(["professional", "conversational", "technical", "friendly"])
    .optional(),
  questionCount: z
    .number()
    .int()
    .min(MIN_INTERVIEW_QUESTIONS)
    .max(MAX_INTERVIEW_QUESTIONS)
    .optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = schema.parse(await request.json());
    const { session, openingMessage } = await createInterviewSession(
      user.id,
      body.resumeId,
      {
        jobDescriptionId: body.jobDescriptionId,
        avatarId: body.avatarId,
        answerLength: body.answerLength,
        answerTone: body.answerTone,
        questionCount: body.questionCount,
      }
    );

    return jsonOk({
      sessionId: session._id.toString(),
      openingMessage,
      difficulty: session.currentDifficulty,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("Start interview error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to start interview",
      500
    );
  }
}
