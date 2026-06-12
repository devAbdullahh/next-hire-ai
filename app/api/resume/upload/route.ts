import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import { MAX_RESUME_SIZE_BYTES } from "@/lib/constants";
import { createResumeFromPdf } from "@/services/resume.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonError("PDF file is required");
    }

    if (file.type !== "application/pdf") {
      return jsonError("Only PDF files are allowed");
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return jsonError("File must be under 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resume = await createResumeFromPdf(
      user.id,
      file.name,
      buffer
    );

    return jsonOk({
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
        skills: resume.skills,
        experience: resume.experience,
        projects: resume.projects,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("Resume upload error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Upload failed",
      500
    );
  }
}
