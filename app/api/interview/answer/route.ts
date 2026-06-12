import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import { processUserAnswer } from "@/services/interview.service";
import { finalizeSession } from "@/services/report.service";
import { getResumeById } from "@/services/resume.service";

export const runtime = "nodejs";

const schema = z.object({
  sessionId: z.string().min(1),
  answer: z.string().min(1).max(8000),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { sessionId, answer } = schema.parse(await request.json());

    const result = await processUserAnswer(sessionId, user.id, answer);

    let report = null;
    if (result.isComplete) {
      const resume = await getResumeById(
        result.session.resumeId.toString(),
        user.id
      );
      if (resume) {
        const finalized = await finalizeSession(sessionId, user.id, resume);
        report = finalized.report;
      }
    }

    return jsonOk({
      aiResponse: result.aiResponse,
      score: result.latestScore,
      difficulty: result.session.currentDifficulty,
      isComplete: result.isComplete,
      report,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("Answer error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to process answer",
      500
    );
  }
}
