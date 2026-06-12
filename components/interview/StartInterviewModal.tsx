"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { AvatarCarousel } from "@/components/avatars/AvatarCarousel";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import {
  MIN_INTERVIEW_QUESTIONS,
  MAX_INTERVIEW_QUESTIONS,
} from "@/lib/constants";
import { ANSWER_LENGTH_OPTIONS, ANSWER_TONE_OPTIONS } from "@/lib/interview-config";
import { DEFAULT_INTERVIEWER_AVATAR_ID } from "@/lib/interviewer-avatars";
import {
  clampQuestionCount,
  normalizeInterviewConfig,
} from "@/lib/normalize-interview-config";
import { stopSpeaking } from "@/lib/speech";
import type { InterviewConfig, InterviewerAvatarId, JobDescriptionItem } from "@/types";
import type { ResumeListItem } from "@/types/resume";

interface StartInterviewModalProps {
  open: boolean;
  onClose: () => void;
  resumes: ResumeListItem[];
  onResumeAdded: (resume: ResumeListItem) => void;
  jobDescriptions: JobDescriptionItem[];
  /** User defaults from settings — pre-fill the form, overridable per session */
  interviewConfig: InterviewConfig;
  defaultResumeId?: string;
}

const selectClassName =
  "w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function StartInterviewModal({
  open,
  onClose,
  resumes,
  onResumeAdded,
  jobDescriptions,
  interviewConfig,
  defaultResumeId,
}: StartInterviewModalProps) {
  const router = useRouter();
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] =
    useState<InterviewerAvatarId>(DEFAULT_INTERVIEWER_AVATAR_ID);
  const [answerLength, setAnswerLength] = useState<InterviewConfig["answerLength"]>("medium");
  const [answerTone, setAnswerTone] = useState<InterviewConfig["answerTone"]>("professional");
  const [questionCount, setQuestionCount] = useState(MIN_INTERVIEW_QUESTIONS);
  const [showUpload, setShowUpload] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const defaults = normalizeInterviewConfig(interviewConfig);
    setSelectedResumeId(defaultResumeId ?? resumes[0]?.id ?? "");
    setSelectedJobId("");
    setSelectedAvatarId(DEFAULT_INTERVIEWER_AVATAR_ID);
    setAnswerLength(defaults.answerLength);
    setAnswerTone(defaults.answerTone);
    setQuestionCount(defaults.questionCount);
    setShowUpload(resumes.length === 0);
    setError("");
    stopSpeaking();
  }, [open, defaultResumeId, resumes, interviewConfig]);

  const selectedJob = jobDescriptions.find((j) => j.id === selectedJobId);

  async function handleStart() {
    if (!selectedResumeId) {
      setError("Select a resume to continue.");
      return;
    }

    setError("");
    setStarting(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          ...(selectedJobId && { jobDescriptionId: selectedJobId }),
          avatarId: selectedAvatarId,
          answerLength,
          answerTone,
          questionCount: clampQuestionCount(questionCount),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to start");
        return;
      }
      onClose();
      router.push(`/interview/${json.data.sessionId}`);
    } catch {
      setError("Could not start interview");
    } finally {
      setStarting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Start new interview"
      description="Pick an avatar, resume, and session settings for this interview."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={starting}
            disabled={!selectedResumeId}
            onClick={handleStart}
          >
            Begin interview
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="resume-picker" className="text-sm font-medium text-foreground">
              Resume
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUpload((v) => !v)}
            >
              {showUpload ? "Hide upload" : "Upload resume"}
            </Button>
          </div>

          {showUpload && (
            <div className="rounded-[10px] border border-border bg-surface-muted p-4">
              <ResumeUpload
                variant="inline"
                onUploaded={(resume) => {
                  onResumeAdded(resume);
                  setSelectedResumeId(resume.id);
                  setShowUpload(false);
                }}
              />
            </div>
          )}

          {resumes.length > 0 ? (
            <select
              id="resume-picker"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className={selectClassName}
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          ) : (
            !showUpload && (
              <p className="text-sm text-muted">
                No resumes yet. Click <strong className="text-foreground">Upload resume</strong> to add one.
              </p>
            )
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="job-picker" className="text-sm font-medium text-foreground">
            Target role (optional)
          </label>
          <select
            id="job-picker"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className={selectClassName}
          >
            <option value="">Resume-only interview</option>
            {jobDescriptions.map((jd) => (
              <option key={jd.id} value={jd.id}>
                {jd.company ? `${jd.title} · ${jd.company}` : jd.title}
              </option>
            ))}
          </select>
          {jobDescriptions.length === 0 && (
            <p className="text-xs text-subtle">
              <Link href="/target-roles" className="text-accent hover:underline">
                Add target roles
              </Link>{" "}
              to practice for specific job postings.
            </p>
          )}
        </div>

        <AvatarCarousel
          selectedId={selectedAvatarId}
          onSelect={setSelectedAvatarId}
        />

        <div className="rounded-[10px] border border-border bg-surface-muted p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Session configuration</p>
            <Link href="/settings" className="text-xs text-accent hover:underline">
              Edit defaults
            </Link>
          </div>
          <p className="mb-4 text-xs text-muted">
            Pre-filled from your settings. Change here to apply only to this interview.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="session-answer-length" className="text-xs font-medium text-foreground">
                Answer length
              </label>
              <select
                id="session-answer-length"
                value={answerLength}
                onChange={(e) =>
                  setAnswerLength(e.target.value as InterviewConfig["answerLength"])
                }
                className={selectClassName}
              >
                {ANSWER_LENGTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.hint}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="session-answer-tone" className="text-xs font-medium text-foreground">
                Answer tone
              </label>
              <select
                id="session-answer-tone"
                value={answerTone}
                onChange={(e) =>
                  setAnswerTone(e.target.value as InterviewConfig["answerTone"])
                }
                className={selectClassName}
              >
                {ANSWER_TONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.hint}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="session-question-count" className="text-xs font-medium text-foreground">
                Number of questions ({MIN_INTERVIEW_QUESTIONS}–{MAX_INTERVIEW_QUESTIONS})
              </label>
              <input
                id="session-question-count"
                type="number"
                min={MIN_INTERVIEW_QUESTIONS}
                max={MAX_INTERVIEW_QUESTIONS}
                step={1}
                value={questionCount}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") {
                    setQuestionCount(MIN_INTERVIEW_QUESTIONS);
                    return;
                  }
                  const parsed = parseInt(raw, 10);
                  if (!Number.isNaN(parsed)) {
                    setQuestionCount(clampQuestionCount(parsed));
                  }
                }}
                className={selectClassName}
              />
            </div>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-muted">
          {selectedJob ? (
            <>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Role-specific questions cross-referencing resume + JD
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Job fit score and gap analysis in final report
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Real-time scoring per answer
              </li>
            </>
          ) : (
            <>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Resume-specific questions
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Real-time scoring per answer
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                Final performance report
              </li>
            </>
          )}
        </ul>

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
