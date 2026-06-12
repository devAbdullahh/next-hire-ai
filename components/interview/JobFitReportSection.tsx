import { Badge } from "@/components/ui/Badge";
import type { InterviewReport } from "@/types";

interface JobFitReportSectionProps {
  report: InterviewReport;
}

export function JobFitReportSection({ report }: JobFitReportSectionProps) {
  if (report.jobFitScore === undefined && !report.jobFitSummary) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-[10px] border border-accent/30 bg-accent-soft/50 p-4">
      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold text-accent">
          {report.jobFitScore ?? "—"}
          {report.jobFitScore !== undefined && (
            <span className="text-base font-normal text-muted"> / 100</span>
          )}
        </p>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Role fit score
          </p>
          {report.jobFitSummary && (
            <p className="text-sm text-muted">{report.jobFitSummary}</p>
          )}
        </div>
      </div>

      {report.roleStrengths && report.roleStrengths.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Resume ↔ role strengths
          </p>
          <ul className="space-y-1.5">
            {report.roleStrengths.map((s, i) => (
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
      )}

      {report.roleGaps && report.roleGaps.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Gaps vs job description
          </p>
          <ul className="space-y-1.5">
            {report.roleGaps.map((g, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-muted"
              >
                <Badge variant="outline" className="shrink-0">
                  Gap
                </Badge>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
