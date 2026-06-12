import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { jsonError, unauthorized } from "@/lib/api";
import { ORPHEUS_MAX_INPUT_CHARS } from "@/lib/orpheus-voices";
import { synthesizeOrpheusSpeech } from "@/services/tts.service";

export const runtime = "nodejs";

const schema = z.object({
  text: z.string().min(1).max(ORPHEUS_MAX_INPUT_CHARS),
  avatarId: z.enum(["monica", "marcus", "elena", "james", "priya"]),
  chunkIndex: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  try {
    await requireAuth();
    const { text, avatarId, chunkIndex } = schema.parse(await request.json());
    const audio = await synthesizeOrpheusSpeech(text, avatarId, chunkIndex ?? 0);

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }
    if (error instanceof z.ZodError) {
      return jsonError("Invalid input");
    }
    console.error("TTS error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to generate speech",
      500
    );
  }
}
