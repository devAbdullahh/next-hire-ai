import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface OverviewClientProps {
  stats: {
    resumeCount: number;
    interviewCount: number;
    completedCount: number;
    avgScore: number | null;
  };
  recentInterviews: {
    id: string;
    resumeName: string;
    status: string;
    avgScore: number | null;
    updatedAt: Date;
  }[];
}

export function OverviewClient({ stats, recentInterviews }: OverviewClientProps) {
  const statCards = [
    { label: "Resumes", value: stats.resumeCount, href: "/resumes" },
    { label: "Interviews", value: stats.interviewCount, href: "/interviews" },
    { label: "Completed", value: stats.completedCount, href: "/interviews" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-elevated">
              <CardHeader className="mb-0">
                <CardDescription>{s.label}</CardDescription>
                <p className="mt-1 text-3xl font-bold text-accent">{s.value}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {stats.avgScore !== null && (
        <Card variant="muted">
          <p className="text-sm text-muted">Average answer score across all interviews</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {stats.avgScore}
            <span className="text-base font-normal text-subtle"> / 10</span>
          </p>
        </Card>
      )}

      <Card variant="elevated">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <CardTitle>Recent interviews</CardTitle>
          <Link href="/resumes">
            <Button size="sm">New interview</Button>
          </Link>
        </div>
        {recentInterviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No interviews yet.{" "}
            <Link href="/resumes" className="text-accent hover:underline">
              Upload a resume
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recentInterviews.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium text-foreground">{inv.resumeName}</p>
                  <p className="text-xs text-subtle">
                    {formatDate(inv.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inv.status === "completed" ? "success" : "accent"}>
                    {inv.status}
                  </Badge>
                  {inv.avgScore !== null && (
                    <span className="text-sm text-muted">{inv.avgScore}/10 avg</span>
                  )}
                  <Link href={`/interviews/${inv.id}`}>
                    <Button variant="secondary" size="sm">View</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/resumes", title: "Manage resumes", desc: "Upload and parse PDF resumes" },
          { href: "/interviews", title: "Interview history", desc: "Review sessions and reports" },
          { href: "/avatars", title: "Browse avatars", desc: "Unique voices and styles" },
          { href: "/target-roles", title: "Target roles", desc: "Practice for specific job postings" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card variant="muted" className="h-full hover:border-accent/30 transition-colors">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="mt-2">{item.desc}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
