import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import {
  createJobDescription,
  listJobDescriptionsForUser,
} from "@/services/job-description.service";

export const runtime = "nodejs";

const createSchema = z.object({
  title: z.string().min(1),
  company: z.string().optional(),
  rawText: z.string().min(50),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await listJobDescriptionsForUser(user.id);

    return jsonOk({
      jobDescriptions: items.map((jd) => ({
        id: jd._id.toString(),
        title: jd.title,
        company: jd.company,
        rawText: jd.rawText,
        createdAt: jd.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = createSchema.parse(await request.json());
    const jd = await createJobDescription(user.id, data);

    return jsonOk({
      jobDescription: {
        id: jd._id.toString(),
        title: jd.title,
        company: jd.company,
        rawText: jd.rawText,
        createdAt: jd.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("Create job description error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to save job description",
      500
    );
  }
}
