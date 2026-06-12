"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ScoreDisplay } from "./ScoreDisplay";
import { InterviewReportModal } from "./InterviewReportModal";
import { InterviewerAvatarFace } from "@/components/interview/InterviewerAvatarFace";
import { getInterviewerAvatar } from "@/lib/interviewer-avatars";
import {
  chunkTextForOrpheus,
  ensureVoicesLoaded,
  speakText,
  stopSpeaking,
  textForSpeech,
} from "@/lib/speech";
import type { InterviewerAvatarId, AnswerScore, InterviewReport } from "@/types";

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
    isFinal?: boolean;
  };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

type CallPhase = "interviewer-speaking" | "your-turn" | "processing" | "complete";

interface VoiceInterviewProps {
  sessionId: string;
  openingMessage: string;
  maxQuestions?: number;
  jobTitle?: string;
  interviewerAvatarId?: InterviewerAvatarId;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceInterview({
  sessionId,
  openingMessage,
  maxQuestions = 8,
  jobTitle,
  interviewerAvatarId = "monica",
}: VoiceInterviewProps) {
  const avatar = getInterviewerAvatar(interviewerAvatarId);
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; content: string }[]
  >([{ role: "ai", content: openingMessage }]);
  const [phase, setPhase] = useState<CallPhase>("interviewer-speaking");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [latestScore, setLatestScore] = useState<AnswerScore | null>(null);
  const [difficulty, setDifficulty] = useState("junior");
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [autoListen, setAutoListen] = useState(true);
  const [speakingChunk, setSpeakingChunk] = useState("");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const spokenRef = useRef<Set<string>>(new Set());
  const autoListenRef = useRef(autoListen);
  const phaseRef = useRef(phase);
  const transcriptRef = useRef(transcript);
  const submitAnswerRef = useRef<(text?: string) => void>(() => {});

  const answerCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => {
    autoListenRef.current = autoListen;
  }, [autoListen]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || phaseRef.current !== "your-turn") return;
    try {
      setTranscript("");
      recognition.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speakInterviewer = useCallback(
    (text: string, key: string, onDone?: () => void) => {
      if (spokenRef.current.has(key)) {
        onDone?.();
        return;
      }
      spokenRef.current.add(key);
      setPhase("interviewer-speaking");
      stopListening();

      const chunks = chunkTextForOrpheus(textForSpeech(text));
      setSpeakingChunk(chunks[0] ?? "");

      void speakText(text, {
        avatarId: avatar.id,
        onStart: () => setPhase("interviewer-speaking"),
        onChunkStart: (chunk) => setSpeakingChunk(chunk),
        onEnd: () => {
          setSpeakingChunk("");
          if (phaseRef.current === "complete") return;
          setPhase("your-turn");
          onDone?.();
          if (autoListenRef.current) {
            setTimeout(() => startListening(), 600);
          }
        },
      });
    },
    [startListening, avatar.id]
  );

  useEffect(() => {
    ensureVoicesLoaded().then(() => {
      const key = `open-${openingMessage.slice(0, 40)}`;
      speakInterviewer(openingMessage, key);
    });
  }, [openingMessage, speakInterviewer]);

  async function submitAnswer(text?: string) {
    const answer = (text ?? transcript).trim();
    if (!answer || phase === "processing" || phase === "complete") return;

    stopListening();
    stopSpeaking();
    setSpeakingChunk("");
    setPhase("processing");
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setTranscript("");

    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const { aiResponse, score, difficulty: diff, isComplete: done, report: rpt } =
        json.data;

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
      if (score) setLatestScore(score);
      if (diff) setDifficulty(diff);

      if (done) {
        setPhase("complete");
        if (rpt) {
          setReport(rpt);
          setReportOpen(true);
        }
        speakInterviewer(aiResponse, `end-${aiResponse.slice(0, 30)}`);
      } else {
        speakInterviewer(aiResponse, `resp-${aiResponse.slice(0, 40)}`);
      }
    } catch (err) {
      console.error(err);
      const fallback = "Sorry — I lost you for a second. Could you repeat that?";
      setMessages((prev) => [...prev, { role: "ai", content: fallback }]);
      speakInterviewer(fallback, "err-retry", () => setPhase("your-turn"));
    }
  }

  submitAnswerRef.current = submitAnswer;

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal === false) interim += text;
        else finalText += text;
      }
      setTranscript(finalText || interim);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      const text = transcriptRef.current.trim();
      if (text && phaseRef.current === "your-turn" && autoListenRef.current) {
        submitAnswerRef.current(text);
      }
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      stopSpeaking();
    };
  }, []);

  function handleMicPress() {
    if (phase === "processing" || phase === "complete") return;
    if (phase === "interviewer-speaking") {
      stopSpeaking();
      setSpeakingChunk("");
      setPhase("your-turn");
      return;
    }
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }

  const phaseLabel = {
    "interviewer-speaking": `${avatar.name} speaking`,
    "your-turn": listening ? "Listening to you…" : "Your turn — tap mic to speak",
    processing: "Processing your answer…",
    complete: "Interview complete",
  }[phase];

  return (
    <>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-[#12100e] shadow-elevated">
        {/* Call header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium text-foreground">Live interview</span>
            {jobTitle && (
              <Badge variant="muted" className="hidden sm:inline-flex">
                {jobTitle}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-subtle">
            <span>{formatDuration(elapsed)}</span>
            <span>
              Q{Math.min(answerCount + 1, maxQuestions)}/{maxQuestions}
            </span>
            <Badge variant="outline">{difficulty}</Badge>
          </div>
        </div>

        {/* Video-style panels */}
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {/* Interviewer */}
          <div className="relative flex min-h-[220px] flex-col items-center justify-center bg-[#1a1714] p-6 sm:min-h-[280px]">
            <InterviewerAvatarFace
              avatar={avatar}
              speaking={phase === "interviewer-speaking"}
            />
            <p className="mt-4 text-sm font-medium text-foreground">{avatar.name}</p>
            <p className="text-xs text-accent">{avatar.role}</p>
            <p className="mt-1 text-xs text-subtle">{phaseLabel}</p>
            {phase === "interviewer-speaking" && speakingChunk && (
              <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-muted">
                &ldquo;{speakingChunk}&rdquo;
              </p>
            )}
          </div>

          {/* Candidate */}
          <div className="relative flex min-h-[220px] flex-col items-center justify-center bg-[#141210] p-6 sm:min-h-[280px]">
            <div
              className={`relative flex size-24 items-center justify-center rounded-full border-2 sm:size-28 ${
                listening
                  ? "border-success bg-success-soft shadow-[0_0_32px_rgba(74,222,128,0.25)]"
                  : "border-border bg-surface-muted"
              }`}
            >
              <span className="text-2xl font-semibold text-muted">You</span>
              {listening && (
                <span className="absolute -bottom-1 -right-1 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white">
                  LIVE
                </span>
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">You</p>
            <p className="mt-1 text-xs text-subtle">
              {listening ? "Speak naturally — we'll submit when you pause" : phaseLabel}
            </p>
            {transcript && (
              <p className="mt-4 line-clamp-3 max-w-xs text-center text-sm leading-relaxed text-foreground">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="border-t border-border bg-surface px-4 py-5 sm:px-6">
          {!voiceSupported && (
            <Alert variant="info" className="mb-4">
              Speech recognition isn&apos;t available in this browser. Type your answer below.
            </Alert>
          )}

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={handleMicPress}
                  disabled={phase === "processing" || phase === "complete"}
                  className={`flex size-16 items-center justify-center rounded-full transition-all ${
                    listening
                      ? "bg-danger text-white shadow-lg"
                      : phase === "interviewer-speaking"
                        ? "bg-surface-muted text-muted hover:bg-surface"
                        : "bg-accent text-white shadow-[0_0_24px_rgba(240,98,122,0.4)] hover:brightness-110"
                  } disabled:opacity-50`}
                  aria-label={listening ? "Stop speaking" : "Start speaking"}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {listening ? (
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    ) : (
                      <>
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                      </>
                    )}
                  </svg>
                </button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => submitAnswer()}
                loading={phase === "processing"}
                disabled={!transcript.trim() || phase === "complete"}
              >
                Send answer
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranscript((v) => !v)}
              >
                {showTranscript ? "Hide transcript" : "Transcript"}
              </Button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-subtle">
              <input
                type="checkbox"
                checked={autoListen}
                onChange={(e) => setAutoListen(e.target.checked)}
                className="rounded border-border"
              />
              Auto-listen when {avatar.name} finishes (hands-free)
            </label>

            {!voiceSupported && (
              <textarea
                className="min-h-[80px] w-full max-w-lg resize-none rounded-[10px] border border-border bg-surface-muted px-3.5 py-3 text-sm"
                placeholder="Type your answer…"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                disabled={phase === "complete"}
              />
            )}
          </div>
        </div>

        {showTranscript && (
          <div className="custom-scrollbar max-h-48 space-y-2 border-t border-border bg-surface-muted p-4">
            {messages.map((m, i) => (
              <p key={i} className="text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {m.role === "ai" ? avatar.name : "You"}:
                </span>{" "}
                {m.content}
              </p>
            ))}
          </div>
        )}
      </div>

      {latestScore && (
        <Card variant="muted" className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
            Latest answer score
          </p>
          <ScoreDisplay score={latestScore} compact />
        </Card>
      )}

      {phase === "complete" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setReportOpen(true)}>View report</Button>
          <Link href={`/interviews/${sessionId}`}>
            <Button variant="secondary">Session details</Button>
          </Link>
        </div>
      )}

      <InterviewReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        report={report}
      />
    </>
  );
}
