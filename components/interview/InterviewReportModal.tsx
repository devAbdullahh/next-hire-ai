"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { JobFitReportSection } from "@/components/interview/JobFitReportSection";
import type { InterviewReport } from "@/types";

interface InterviewReportModalProps {
  open: boolean;
  onClose: () => void;
  report: InterviewReport | null;
}

export function InterviewReportModal({
  open,
  onClose,
  report,
}: InterviewReportModalProps) {
  if (!report) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Interview complete"
      description="Your performance summary and learning roadmap"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href="/interviews">
            <Button>View all interviews</Button>
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-[10px] bg-accent-soft p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">{report.overallScore}</p>
            <p className="text-xs text-muted">Overall / 100</p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-foreground">
            {report.summary}
          </p>
        </div>

        <JobFitReportSection report={report} />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Strengths
          </p>
          <ul className="space-y-1.5">
            {report.strengths.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-success"
              >
                <span aria-hidden>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Areas to improve
          </p>
          <ul className="space-y-1.5">
            {report.weakAreas.map((w, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-muted"
              >
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Improvement roadmap
          </p>
          <ol className="space-y-2">
            {report.improvementRoadmap.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <Badge variant="accent" className="shrink-0">
                  {i + 1}
                </Badge>
                <span className="text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[10px] border border-border bg-surface-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle mb-2">
            Detailed feedback
          </p>
          <p className="text-sm leading-relaxed text-muted">
            {report.detailedFeedback}
          </p>
        </div>
      </div>
    </Modal>
  );
}
