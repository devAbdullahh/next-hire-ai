import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import { deleteJobDescription } from "@/services/job-description.service";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const deleted = await deleteJobDescription(id, user.id);

    if (!deleted) {
      return jsonError("Job description not found", 404);
    }

    return jsonOk({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("Delete job description error:", error);
    return jsonError("Failed to delete job description", 500);
  }
}
