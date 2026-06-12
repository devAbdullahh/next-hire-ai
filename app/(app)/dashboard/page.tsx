import { AppPage } from "@/components/layout/AppPage";
import { OverviewClient } from "@/components/dashboard/OverviewClient";
import { listResumesForUser } from "@/services/resume.service";
import { listSessions } from "@/services/interview.service";
import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [resumes, sessions] = await Promise.all([
    listResumesForUser(user.id),
    listSessions(user.id),
  ]);

  const allScores = sessions.flatMap((s) => s.scores.map((sc) => sc.score));
  const avgScore =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : null;

  const resumeMap = new Map(resumes.map((r) => [r._id.toString(), r.fileName]));

  const recentInterviews = sessions.slice(0, 5).map((s) => ({
    id: s._id.toString(),
    resumeName: resumeMap.get(s.resumeId.toString()) ?? "Resume",
    status: s.status,
    avgScore:
      s.scores.length > 0
        ? Math.round(
            (s.scores.reduce((a, sc) => a + sc.score, 0) / s.scores.length) * 10
          ) / 10
        : null,
    updatedAt: s.updatedAt,
  }));

  return (
    <AppPage
      breadcrumbs={[{ label: "Overview" }]}
      title="Overview"
      description="Your interview prep at a glance."
    >
      <OverviewClient
        stats={{
          resumeCount: resumes.length,
          interviewCount: sessions.length,
          completedCount: sessions.filter((s) => s.status === "completed").length,
          avgScore,
        }}
        recentInterviews={recentInterviews}
      />
    </AppPage>
  );
}
