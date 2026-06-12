import { requireAuth } from "@/lib/auth";
import { jsonOk, unauthorized } from "@/lib/api";
import { listSessions } from "@/services/interview.service";
import { listResumesForUser } from "@/services/resume.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const [sessions, resumes] = await Promise.all([
      listSessions(user.id),
      listResumesForUser(user.id),
    ]);

    const resumeMap = new Map(
      resumes.map((r) => [r._id.toString(), r.fileName])
    );

    return jsonOk({
      interviews: sessions.map((s) => {
        const userAnswers = s.messages.filter((m) => m.role === "user").length;
        const avgScore =
          s.scores.length > 0
            ? s.scores.reduce((a, sc) => a + sc.score, 0) / s.scores.length
            : null;

        return {
          id: s._id.toString(),
          resumeId: s.resumeId.toString(),
          resumeName: resumeMap.get(s.resumeId.toString()) ?? "Resume",
          status: s.status,
          currentDifficulty: s.currentDifficulty,
          messageCount: s.messages.length,
          answerCount: userAnswers,
          avgScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
          hasReport: !!s.report,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        };
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    throw error;
  }
}
