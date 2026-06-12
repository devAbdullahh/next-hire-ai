"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import {
  ANSWER_LENGTH_OPTIONS,
  ANSWER_TONE_OPTIONS,
} from "@/lib/interview-config";
import { normalizeInterviewConfig } from "@/lib/normalize-interview-config";
import {
  MIN_INTERVIEW_QUESTIONS,
  MAX_INTERVIEW_QUESTIONS,
} from "@/lib/constants";
import { clampQuestionCount } from "@/lib/normalize-interview-config";
import type { InterviewConfig } from "@/types";

interface InterviewConfigFormProps {
  initialConfig: InterviewConfig;
}

const selectClassName =
  "w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function InterviewConfigForm({ initialConfig }: InterviewConfigFormProps) {
  const normalizedInitial = normalizeInterviewConfig(initialConfig);
  const [config, setConfig] = useState(normalizedInitial);
  const [saved, setSaved] = useState(normalizedInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const dirty =
    config.answerLength !== saved.answerLength ||
    config.answerTone !== saved.answerTone ||
    config.questionCount !== saved.questionCount;

  async function handleSave() {
    setError("");
    setSuccess(false);
    setLoading(true);

    const payload = normalizeInterviewConfig(config);

    try {
      const res = await fetch("/api/settings/interview-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to save");
        return;
      }
      const next = normalizeInterviewConfig(json.data.interviewConfig);
      setSaved(next);
      setConfig(next);
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuestionCountChange(raw: string) {
    if (raw === "") {
      setConfig((c) => ({ ...c, questionCount: MIN_INTERVIEW_QUESTIONS }));
      setSuccess(false);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      setConfig((c) => ({
        ...c,
        questionCount: clampQuestionCount(parsed),
      }));
      setSuccess(false);
    }
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Interview configuration</CardTitle>
        <CardDescription>
          Default answer style for new interviews. You can override length, tone,
          and question count each time you start a session.
        </CardDescription>
      </CardHeader>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="answer-length" className="text-sm font-medium text-foreground">
            Answer length
          </label>
          <select
            id="answer-length"
            value={config.answerLength}
            onChange={(e) => {
              setConfig((c) => ({
                ...c,
                answerLength: e.target.value as InterviewConfig["answerLength"],
              }));
              setSuccess(false);
            }}
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
          <label htmlFor="answer-tone" className="text-sm font-medium text-foreground">
            Answer tone
          </label>
          <select
            id="answer-tone"
            value={config.answerTone}
            onChange={(e) => {
              setConfig((c) => ({
                ...c,
                answerTone: e.target.value as InterviewConfig["answerTone"],
              }));
              setSuccess(false);
            }}
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
          <label htmlFor="default-questions" className="text-sm font-medium text-foreground">
            Default number of questions ({MIN_INTERVIEW_QUESTIONS}–{MAX_INTERVIEW_QUESTIONS})
          </label>
          <input
            id="default-questions"
            type="number"
            min={MIN_INTERVIEW_QUESTIONS}
            max={MAX_INTERVIEW_QUESTIONS}
            step={1}
            value={config.questionCount}
            onChange={(e) => handleQuestionCountChange(e.target.value)}
            className={selectClassName}
          />
          <p className="text-xs text-subtle">
            Pre-filled when you start an interview — change it in the start modal for that session only.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" className="mt-4">{error}</Alert>}
      {success && (
        <Alert variant="success" className="mt-4">
          Default configuration saved. New interviews will pre-fill with these values.
        </Alert>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSave} loading={loading} disabled={!dirty}>
          Save configuration
        </Button>
        {dirty && (
          <Button
            variant="ghost"
            onClick={() => {
              setConfig(saved);
              setSuccess(false);
              setError("");
            }}
          >
            Discard changes
          </Button>
        )}
      </div>
    </Card>
  );
}
