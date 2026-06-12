import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import { getSession } from "@/services/interview.service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await requireAuth();
    const { sessionId } = await params;
    const session = await getSession(sessionId, user.id);

    if (!session) {
      return jsonError("Session not found", 404);
    }

    return jsonOk({
      session: {
        id: session._id.toString(),
        resumeId: session.resumeId.toString(),
        messages: session.messages,
        scores: session.scores,
        currentDifficulty: session.currentDifficulty,
        status: session.status,
        report: session.report,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    throw error;
  }
}
