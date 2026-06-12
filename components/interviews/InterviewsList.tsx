"use client";

import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface InterviewListItem {
  id: string;
  resumeId: string;
  resumeName: string;
  jobTitle?: string;
  status: string;
  currentDifficulty: string;
  answerCount: number;
  avgScore: number | null;
  hasReport: boolean;
  updatedAt: string;
}

interface InterviewsListProps {
  interviews: InterviewListItem[];
  onStartNew?: () => void;
}

export function InterviewsList({ interviews, onStartNew }: InterviewsListProps) {
  if (interviews.length === 0) {
    return (
      <Card variant="muted" className="py-16 text-center">
        <CardTitle className="text-base">No interviews yet</CardTitle>
        <CardDescription className="mt-2">
          Start a mock interview — pick a resume and optional target role.
        </CardDescription>
        {onStartNew ? (
          <Button className="mt-6" onClick={onStartNew}>
            Start new interview
          </Button>
        ) : (
          <Link href="/resumes" className="mt-6 inline-block">
            <Button>Go to resumes</Button>
          </Link>
        )}
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {interviews.map((inv) => (
        <li key={inv.id}>
          <Card className="transition-shadow hover:shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardHeader className="mb-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{inv.resumeName}</CardTitle>
                  {inv.jobTitle && (
                    <Badge variant="muted">{inv.jobTitle}</Badge>
                  )}
                  <Badge variant={inv.status === "completed" ? "success" : "accent"}>
                    {inv.status}
                  </Badge>
                  <Badge variant="outline">{inv.currentDifficulty}</Badge>
                </div>
                <CardDescription>
                  {inv.answerCount} answer{inv.answerCount !== 1 ? "s" : ""}
                  {inv.avgScore !== null && ` · ${inv.avgScore}/10 avg`}
                  {" · "}
                  {formatDateTime(inv.updatedAt)}
                </CardDescription>
              </CardHeader>
              <div className="flex shrink-0 flex-wrap gap-2">
                {inv.status === "active" && (
                  <Link href={`/interview/${inv.id}`}>
                    <Button size="sm">Continue</Button>
                  </Link>
                )}
                <Link href={`/interviews/${inv.id}`}>
                  <Button variant="secondary" size="sm">
                    {inv.hasReport ? "View report" : "Details"}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
