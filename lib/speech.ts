/** Client speech playback via Groq Orpheus TTS */

import { chunkTextForOrpheus, textForSpeech } from "@/lib/speech-chunks";
import type { InterviewerAvatarId } from "@/types";

export { textForSpeech, chunkTextForOrpheus } from "@/lib/speech-chunks";

export interface SpeakOptions {
  avatarId?: InterviewerAvatarId;
  onStart?: () => void;
  onEnd?: () => void;
  /** Fires when each TTS chunk begins playing (text is Orpheus-sized, ≤200 chars). */
  onChunkStart?: (chunk: string, index: number, total: number) => void;
}

let playbackController: AbortController | null = null;
let currentAudio: HTMLAudioElement | null = null;
let startedCallbackFired = false;

async function fetchSpeechChunk(
  text: string,
  avatarId: InterviewerAvatarId,
  chunkIndex: number,
  signal: AbortSignal
): Promise<Blob> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, avatarId, chunkIndex }),
    signal,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? "Failed to generate speech");
  }

  return res.blob();
}

function playBlob(blob: Blob, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;

    const cleanup = () => {
      audio.pause();
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
    };

    const onAbort = () => {
      cleanup();
      resolve();
    };

    signal.addEventListener("abort", onAbort, { once: true });

    audio.onended = () => {
      signal.removeEventListener("abort", onAbort);
      cleanup();
      resolve();
    };

    audio.onerror = () => {
      signal.removeEventListener("abort", onAbort);
      cleanup();
      reject(new Error("Audio playback failed"));
    };

    audio.play().catch((err) => {
      signal.removeEventListener("abort", onAbort);
      cleanup();
      reject(err);
    });
  });
}

/** No-op — kept for callers that awaited browser voice loading. */
export function ensureVoicesLoaded(): Promise<void> {
  return Promise.resolve();
}

export async function speakText(
  text: string,
  options: SpeakOptions = {}
): Promise<void> {
  if (typeof window === "undefined") return;

  const cleaned = textForSpeech(text);
  if (!cleaned) {
    options.onEnd?.();
    return;
  }

  const avatarId = options.avatarId ?? "monica";
  const chunks = chunkTextForOrpheus(cleaned);
  if (chunks.length === 0) {
    options.onEnd?.();
    return;
  }

  stopSpeaking();

  const controller = new AbortController();
  playbackController = controller;
  startedCallbackFired = false;

  try {
    let nextBlobPromise: Promise<Blob> | null = fetchSpeechChunk(
      chunks[0],
      avatarId,
      0,
      controller.signal
    );

    for (let i = 0; i < chunks.length; i++) {
      if (controller.signal.aborted) return;

      const blob = await nextBlobPromise!;
      if (controller.signal.aborted) return;

      if (i + 1 < chunks.length) {
        nextBlobPromise = fetchSpeechChunk(
          chunks[i + 1],
          avatarId,
          i + 1,
          controller.signal
        );
      }

      if (!startedCallbackFired) {
        startedCallbackFired = true;
        options.onStart?.();
      }

      options.onChunkStart?.(chunks[i], i, chunks.length);
      await playBlob(blob, controller.signal);
    }

    if (!controller.signal.aborted) {
      options.onEnd?.();
    }
  } catch (error) {
    if (!controller.signal.aborted) {
      console.error("speakText error:", error);
      options.onEnd?.();
    }
  } finally {
    if (playbackController === controller) {
      playbackController = null;
    }
  }
}

export function stopSpeaking(): void {
  playbackController?.abort();
  playbackController = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
