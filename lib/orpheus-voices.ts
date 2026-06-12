import type { InterviewerAvatarId } from "@/types";

/** Groq Orpheus English voices — https://console.groq.com/docs/text-to-speech/orpheus */
export type OrpheusVoiceId =
  | "autumn"
  | "diana"
  | "hannah"
  | "austin"
  | "daniel"
  | "troy";

export const ORPHEUS_MAX_INPUT_CHARS = 200;

export const AVATAR_ORPHEUS_VOICES: Record<
  InterviewerAvatarId,
  { voice: OrpheusVoiceId; direction?: string }
> = {
  monica: { voice: "hannah", direction: "[warm]" },
  marcus: { voice: "troy", direction: "[confidently]" },
  elena: { voice: "diana", direction: "[professionally]" },
  james: { voice: "austin", direction: "[friendly]" },
  priya: { voice: "autumn", direction: "[confidently]" },
};

export function getOrpheusVoiceForAvatar(
  avatarId: InterviewerAvatarId
): OrpheusVoiceId {
  return AVATAR_ORPHEUS_VOICES[avatarId]?.voice ?? "hannah";
}

export function formatOrpheusInput(
  text: string,
  avatarId: InterviewerAvatarId,
  chunkIndex = 0
): string {
  const trimmed = text.trim().slice(0, ORPHEUS_MAX_INPUT_CHARS);
  if (chunkIndex !== 0) return trimmed;

  const { direction } = AVATAR_ORPHEUS_VOICES[avatarId] ?? {};
  if (!direction) return trimmed;

  const withDirection = `${direction} ${trimmed}`;
  return withDirection.length <= ORPHEUS_MAX_INPUT_CHARS
    ? withDirection
    : trimmed;
}
