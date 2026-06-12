"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ScoreDisplay } from "@/components/interview/ScoreDisplay";
import { RadarChart } from "@/components/ui/RadarChart";
import { averageScoresToRadarAxes } from "@/lib/score-radar";
import { JobFitReportSection } from "@/components/interview/JobFitReportSection";
import { AnswerDetailModal } from "@/components/interview/AnswerDetailModal";
import { getSessionAnswerDetails, type SessionAnswerDetail } from "@/lib/session-answers";
import type { InterviewReport, AnswerScore } from "@/types";

interface SessionDetailClientProps {
  session: {
    id: string;
    resumeName: string;
    jobTitle?: string;
    status: string;
    currentDifficulty: string;
    messages: { role: string; content: string }[];
    scores: AnswerScore[];
    report: InterviewReport | null;
  };
}

export function SessionDetailClient({ session }: SessionDetailClientProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [answerDetail, setAnswerDetail] = useState<SessionAnswerDetail | null>(null);
  const answerDetails = getSessionAnswerDetails(session.messages, session.scores);
  const avgScore =
    session.scores.length > 0
      ? Math.round(
          (session.scores.reduce((a, s) => a + s.score, 0) / session.scores.length) * 10
        ) / 10
      : null;
  const avgRadarAxes = averageScoresToRadarAxes(session.scores);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {session.jobTitle && (
          <Badge variant="muted">{session.jobTitle}</Badge>
        )}
        <Badge variant={session.status === "completed" ? "success" : "accent"}>
          {session.status}
        </Badge>
        <Badge variant="outline">{session.currentDifficulty}</Badge>
        {avgScore !== null && (
          <span className="text-sm text-muted">Average: {avgScore}/10</span>
        )}
      </div>

      {avgRadarAxes && (
        <Card variant="muted">
          <CardTitle className="text-base mb-2">Session performance</CardTitle>
          <CardDescription className="mb-4">
            Average across {session.scores.length} answer{session.scores.length !== 1 ? "s" : ""}
          </CardDescription>
          <div className="flex justify-center">
            <RadarChart axes={avgRadarAxes} size={240} />
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {session.status === "active" && (
          <Link href={`/interview/${session.id}`}>
            <Button>Continue interview</Button>
          </Link>
        )}
        {session.report && (
          <Button variant="secondary" onClick={() => setReportOpen(true)}>
            View full report
          </Button>
        )}
        <Link href="/interviews">
          <Button variant="ghost">Back to list</Button>
        </Link>
      </div>

      {session.scores.length > 0 && (
        <Card variant="muted">
          <CardTitle className="text-base mb-4">Score breakdown</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {answerDetails.map((detail) => (
              <button
                key={detail.questionIndex}
                type="button"
                onClick={() => setAnswerDetail(detail)}
                className="flex w-full cursor-pointer flex-col rounded-[10px] border border-border bg-surface p-4 text-left transition-all hover:border-accent/40 hover:bg-surface-muted hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <p className="text-xs font-semibold text-subtle mb-2">
                  Answer {detail.questionIndex + 1}
                </p>
                <ScoreDisplay score={detail.score} compact />
                <p className="mt-3 line-clamp-2 text-sm text-muted">
                  {detail.score.justification}
                </p>
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card padding="none">
        <CardHeader className="border-b border-border px-5 py-4 mb-0">
          <CardTitle className="text-base">Transcript</CardTitle>
          <CardDescription>Full conversation for this session</CardDescription>
        </CardHeader>
        <div className="custom-scrollbar max-h-[32rem] space-y-3 overflow-y-auto p-5">
          {session.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "ai"
                    ? "rounded-bl-md bg-accent-soft"
                    : "rounded-br-md border border-border bg-surface-muted"
                }`}
              >
                <p className="text-xs font-semibold text-subtle mb-0.5">
                  {m.role === "ai" ? "Avatar" : "You"}
                </p>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AnswerDetailModal
        open={!!answerDetail}
        onClose={() => setAnswerDetail(null)}
        detail={answerDetail}
      />

      {session.report && (
        <Modal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          title="Interview report"
          description={session.resumeName}
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setReportOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-sm">
            <p className="text-2xl font-bold text-accent">
              {session.report.overallScore}
              <span className="text-base font-normal text-muted"> / 100</span>
            </p>
            <p>{session.report.summary}</p>
            <JobFitReportSection report={session.report} />
            <div>
              <p className="font-semibold text-foreground mb-1">Strengths</p>
              <ul className="list-disc pl-5 text-muted space-y-1">
                {session.report.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Roadmap</p>
              <ol className="list-decimal pl-5 text-muted space-y-1">
                {session.report.improvementRoadmap.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
            <p className="text-muted leading-relaxed">{session.report.detailedFeedback}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
