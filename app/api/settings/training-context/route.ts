import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, unauthorized } from "@/lib/api";
import {
  getTrainingContext,
  updateTrainingContext,
} from "@/services/settings.service";
import { MAX_TRAINING_CONTEXT_LENGTH } from "@/lib/constants";

export const runtime = "nodejs";

const updateSchema = z.object({
  trainingContext: z.string().max(MAX_TRAINING_CONTEXT_LENGTH),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const trainingContext = await getTrainingContext(user.id);
    return jsonOk({ trainingContext });
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
    const { trainingContext } = updateSchema.parse(await request.json());
    const saved = await updateTrainingContext(user.id, trainingContext);
    return jsonOk({ trainingContext: saved });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("Update training context error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to save settings",
      500
    );
  }
}
