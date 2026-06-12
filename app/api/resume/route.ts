import { requireAuth } from "@/lib/auth";
import { jsonOk, unauthorized } from "@/lib/api";
import { listResumesForUser } from "@/services/resume.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const resumes = await listResumesForUser(user.id);

    return jsonOk({
      resumes: resumes.map((r) => ({
        id: r._id.toString(),
        fileName: r.fileName,
        skills: r.skills,
        experience: r.experience,
        projects: r.projects,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    throw error;
  }
}
