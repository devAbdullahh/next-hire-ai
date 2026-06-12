import { AppPage } from "@/components/layout/AppPage";
import { InterviewsClient } from "@/components/interviews/InterviewsClient";
import { listSessions } from "@/services/interview.service";
import { listJobDescriptionsForUser } from "@/services/job-description.service";
import { listResumesForUser } from "@/services/resume.service";
import { getAuthUser } from "@/lib/auth";
import { getInterviewConfig } from "@/services/settings.service";

export default async function InterviewsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [sessions, resumes, jobDescriptions, interviewConfig] =
    await Promise.all([
      listSessions(user.id),
      listResumesForUser(user.id),
      listJobDescriptionsForUser(user.id),
      getInterviewConfig(user.id),
    ]);

  const resumeMap = new Map(resumes.map((r) => [r._id.toString(), r.fileName]));

  const interviews = sessions.map((s) => ({
    id: s._id.toString(),
    resumeId: s.resumeId.toString(),
    resumeName: resumeMap.get(s.resumeId.toString()) ?? "Resume",
    jobTitle: s.jobTitle,
    status: s.status,
    currentDifficulty: s.currentDifficulty,
    answerCount: s.messages.filter((m) => m.role === "user").length,
    avgScore:
      s.scores.length > 0
        ? Math.round(
            (s.scores.reduce((a, sc) => a + sc.score, 0) / s.scores.length) * 10
          ) / 10
        : null,
    hasReport: !!s.report,
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Interviews" },
      ]}
      title="Interviews"
      description="All mock interview sessions — continue active ones or review completed reports."
    >
      <InterviewsClient
        interviews={interviews}
        initialResumes={resumes.map((r) => ({
          id: r._id.toString(),
          fileName: r.fileName,
          skills: r.skills,
          experience: r.experience,
          projects: r.projects,
        }))}
        initialJobDescriptions={jobDescriptions.map((jd) => ({
          id: jd._id.toString(),
          title: jd.title,
          company: jd.company,
          rawText: jd.rawText,
          createdAt: jd.createdAt,
        }))}
        interviewConfig={interviewConfig}
      />
    </AppPage>
  );
}
