"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ScoreDisplay } from "@/components/interview/ScoreDisplay";
import type { SessionAnswerDetail } from "@/lib/session-answers";

interface AnswerDetailModalProps {
  open: boolean;
  onClose: () => void;
  detail: SessionAnswerDetail | null;
}

export function AnswerDetailModal({ open, onClose, detail }: AnswerDetailModalProps) {
  if (!detail) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Answer ${detail.questionIndex + 1}`}
      description={`Overall score: ${detail.score.score}/10`}
      size="lg"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Question
          </p>
          <div className="rounded-[10px] bg-accent-soft px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.question || "—"}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Your answer
          </p>
          <div className="rounded-[10px] border border-border bg-surface-muted px-4 py-3 text-sm leading-relaxed text-muted">
            {detail.answer}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
            Score & feedback
          </p>
          <ScoreDisplay score={detail.score} />
        </div>
      </div>
    </Modal>
  );
}
