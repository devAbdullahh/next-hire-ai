"use client";

import { Badge } from "@/components/ui/Badge";
import { RadarChart } from "@/components/ui/RadarChart";
import { averageScoresToRadarAxes } from "@/lib/score-radar";
import type { AnswerScore } from "@/types";

const DEMO_SCORES: AnswerScore[] = [
  {
    questionIndex: 0,
    score: 8.2,
    technicalCorrectness: 8.5,
    depth: 7.5,
    clarity: 8,
    confidence: 8,
    justification: "Solid schema design with clear trade-offs.",
  },
  {
    questionIndex: 1,
    score: 7.4,
    technicalCorrectness: 7,
    depth: 7.5,
    clarity: 8,
    confidence: 7,
    justification: "Good debugging story — add latency metrics.",
  },
  {
    questionIndex: 2,
    score: 7.8,
    technicalCorrectness: 8,
    depth: 7,
    clarity: 8.5,
    confidence: 7.5,
    justification: "Relevant leadership example; add impact numbers.",
  },
];

const reportBullets = [
  "Overall score and session radar at a glance",
  "Per-answer breakdown with AI feedback",
  "Role fit score when you practice for a specific job",
];

export function ReportPreview() {
  const radarAxes = averageScoresToRadarAxes(DEMO_SCORES);
  const avgScore =
    Math.round(
      (DEMO_SCORES.reduce((a, s) => a + s.score, 0) / DEMO_SCORES.length) * 10
    ) / 10;
  const topAnswer = [...DEMO_SCORES].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
      <div className="animate-in space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Performance reports
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Know exactly how you did — and what to fix next.
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Every session ends with a structured report: scores, strengths, role
            fit, and a clear path to improve before your real interview.
          </p>
        </div>

        <ul className="space-y-3">
          {reportBullets.map((text, i) => (
            <li
              key={text}
              className={`animate-in flex items-start gap-3 text-sm text-muted ${["animate-in-delay-1", "animate-in-delay-2", "animate-in-delay-3"][i]}`}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs text-accent">
                ✓
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="animate-in animate-in-delay-2">
        <div className="glow-border rounded-[var(--radius-card)] bg-surface p-1 shadow-elevated">
          <div className="rounded-[calc(var(--radius-card)-4px)] bg-surface-muted p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Interview complete</Badge>
              <Badge variant="muted">Senior Backend Engineer</Badge>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex items-center gap-4 rounded-[10px] bg-accent-soft px-5 py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold leading-none text-accent">78</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
                    Overall
                  </p>
                </div>
                <div className="hidden h-10 w-px bg-border sm:block" />
                <div className="hidden sm:block">
                  <p className="text-2xl font-bold text-foreground">{avgScore}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    Avg / 10
                  </p>
                </div>
              </div>

              {radarAxes && (
                <div className="flex justify-center sm:justify-end">
                  <RadarChart axes={radarAxes} size={168} />
                </div>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground">
              Strong technical communication with resume-backed examples. Tighten
              behavioral answers with metrics for senior roles.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[10px] border border-accent/25 bg-accent-soft/40 px-3 py-3 text-center">
                <p className="text-xl font-bold text-accent">74</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-subtle">
                  Role fit
                </p>
              </div>
              <div className="rounded-[10px] border border-border bg-surface px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
                  Strength
                </p>
                <p className="mt-1 text-xs leading-snug text-success">
                  Clear technical trade-offs
                </p>
              </div>
              <div className="rounded-[10px] border border-border bg-surface px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
                  Gap
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">
                  Surface cloud / AWS experience
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border bg-surface px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-subtle">
                  Sample answer score
                </p>
                <p className="mt-0.5 text-sm text-muted line-clamp-1">
                  {topAnswer.justification}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-accent">{topAnswer.score}/10</p>
                <p className="text-[10px] text-subtle">Q{topAnswer.questionIndex + 1}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-dashed border-accent/30 bg-accent-soft/20 px-3 py-2.5">
              <Badge variant="accent">Next step</Badge>
              <p className="text-xs text-muted">
                Practice STAR format for leadership questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
