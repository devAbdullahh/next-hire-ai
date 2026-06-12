"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { MAX_TRAINING_CONTEXT_LENGTH } from "@/lib/constants";

interface TrainingContextFormProps {
  initialContext: string;
}

const examples = [
  "Focus on backend system design and Node.js depth. Be direct and challenging.",
  "I'm preparing for a frontend role — emphasize React, TypeScript, and UI trade-offs.",
  "Keep a friendly, encouraging tone. I'm a career switcher — explain jargon if needed.",
];

export function TrainingContextForm({ initialContext }: TrainingContextFormProps) {
  const [context, setContext] = useState(initialContext);
  const [saved, setSaved] = useState(initialContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const dirty = context.trim() !== saved.trim();
  const remaining = MAX_TRAINING_CONTEXT_LENGTH - context.length;

  async function handleSave() {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/settings/training-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingContext: context }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to save");
        return;
      }
      setSaved(json.data.trainingContext);
      setContext(json.data.trainingContext);
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Interview training context</CardTitle>
          <CardDescription>
            Tell the AI how to conduct interviews for you. This is injected into every
            interview prompt — tone, focus areas, difficulty style, and role targets.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3">
          <label htmlFor="training-context" className="text-sm font-medium text-foreground">
            Your instructions
          </label>
          <textarea
            id="training-context"
            value={context}
            onChange={(e) => {
              setContext(e.target.value);
              setSuccess(false);
            }}
            maxLength={MAX_TRAINING_CONTEXT_LENGTH}
            rows={8}
            placeholder="e.g. I'm interviewing for senior full-stack roles. Focus on MERN stack projects from my resume. Ask deep follow-ups on API design. Keep answers voice-friendly."
            className="w-full resize-y rounded-[10px] border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-subtle focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <p className={`text-xs ${remaining < 100 ? "text-accent" : "text-subtle"}`}>
            {remaining} characters remaining
          </p>
        </div>

        {error && <Alert variant="error" className="mt-4">{error}</Alert>}
        {success && (
          <Alert variant="success" className="mt-4">
            Training context saved. It will apply to your next interview.
          </Alert>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleSave} loading={loading} disabled={!dirty}>
            Save context
          </Button>
          {dirty && (
            <Button
              variant="ghost"
              onClick={() => {
                setContext(saved);
                setSuccess(false);
                setError("");
              }}
            >
              Discard changes
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
