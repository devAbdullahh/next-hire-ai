import { ORPHEUS_MAX_INPUT_CHARS } from "@/lib/orpheus-voices";

/** Strip characters that sound awkward when read aloud */
export function textForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/[#*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split text into Orpheus-safe chunks (max 200 chars each). */
export function chunkTextForOrpheus(
  text: string,
  maxLen = ORPHEUS_MAX_INPUT_CHARS
): string[] {
  const cleaned = textForSpeech(text);
  if (!cleaned) return [];
  if (cleaned.length <= maxLen) return [cleaned];

  const chunks: string[] = [];
  const sentences =
    cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [cleaned];

  let current = "";

  function flushCurrent() {
    if (current.trim()) {
      chunks.push(current.trim());
      current = "";
    }
  }

  function pushWordChunks(segment: string) {
    const words = segment.split(/\s+/).filter(Boolean);
    let part = "";
    for (const word of words) {
      const next = part ? `${part} ${word}` : word;
      if (next.length > maxLen) {
        if (part) chunks.push(part);
        part = word.length > maxLen ? word.slice(0, maxLen) : word;
      } else {
        part = next;
      }
    }
    if (part) current = part;
  }

  for (const sentence of sentences) {
    const segment = sentence.trim();
    if (!segment) continue;

    if (segment.length > maxLen) {
      flushCurrent();
      pushWordChunks(segment);
      continue;
    }

    const combined = current ? `${current} ${segment}` : segment;
    if (combined.length > maxLen) {
      flushCurrent();
      current = segment;
    } else {
      current = combined;
    }
  }

  flushCurrent();
  return chunks;
}
