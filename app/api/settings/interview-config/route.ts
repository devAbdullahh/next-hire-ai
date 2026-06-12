import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import {
  getInterviewConfig,
  updateInterviewConfig,
} from "@/services/settings.service";
import {
  MIN_INTERVIEW_QUESTIONS,
  MAX_INTERVIEW_QUESTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

const updateSchema = z.object({
  answerLength: z.enum(["short", "medium", "long"]),
  answerTone: z.enum(["professional", "conversational", "technical", "friendly"]),
  questionCount: z.number().int().min(MIN_INTERVIEW_QUESTIONS).max(MAX_INTERVIEW_QUESTIONS),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const config = await getInterviewConfig(user.id);
    return jsonOk({ interviewConfig: config });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    throw error;
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = updateSchema.parse(await request.json());
    const saved = await updateInterviewConfig(user.id, body);
    return jsonOk({ interviewConfig: saved });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("Update interview config error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to save settings",
      500
    );
  }
}
