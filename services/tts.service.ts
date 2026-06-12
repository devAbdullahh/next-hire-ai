import { GROQ_TTS_MODEL } from "@/lib/constants";
import { getGroqClient } from "@/lib/groq";
import {
  formatOrpheusInput,
  getOrpheusVoiceForAvatar,
  ORPHEUS_MAX_INPUT_CHARS,
} from "@/lib/orpheus-voices";
import type { InterviewerAvatarId } from "@/types";

export async function synthesizeOrpheusSpeech(
  text: string,
  avatarId: InterviewerAvatarId,
  chunkIndex = 0
): Promise<ArrayBuffer> {
  const input = formatOrpheusInput(text, avatarId, chunkIndex);
  if (!input) {
    throw new Error("Empty TTS input");
  }
  if (input.length > ORPHEUS_MAX_INPUT_CHARS) {
    throw new Error(`TTS input exceeds ${ORPHEUS_MAX_INPUT_CHARS} characters`);
  }

  const client = getGroqClient();
  const response = await client.audio.speech.create({
    model: GROQ_TTS_MODEL,
    voice: getOrpheusVoiceForAvatar(avatarId),
    input,
    response_format: "wav",
  });

  return response.arrayBuffer();
}
