import { redirect } from "next/navigation";
import { AppPage } from "@/components/layout/AppPage";
import { SessionDetailClient } from "@/components/interviews/SessionDetailClient";
import { getSession } from "@/services/interview.service";
import { getResumeById } from "@/services/resume.service";
import { getAuthUser } from "@/lib/auth";
import { toPlain } from "@/lib/serialize";
import type { InterviewReport } from "@/types";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function InterviewDetailPage({ params }: PageProps) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { sessionId } = await params;
  const session = await getSession(sessionId, user.id);
  if (!session) redirect("/interviews");

  const resume = await getResumeById(session.resumeId.toString(), user.id);
  const resumeName = resume?.fileName ?? "Resume";

  const sessionPayload = toPlain({
    id: session._id.toString(),
    resumeName,
    jobTitle: session.jobTitle,
    status: session.status,
    currentDifficulty: session.currentDifficulty,
    messages: session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    scores: session.scores,
    report: (session.report as InterviewReport | undefined) ?? null,
  });

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Interviews", href: "/interviews" },
        { label: resumeName },
      ]}
      title={session.jobTitle ? `${resumeName} → ${session.jobTitle}` : resumeName}
      description={
        session.jobTitle
          ? "Role-targeted session — transcript, scores, and job fit report."
          : "Session transcript, scores, and report."
      }
    >
      <SessionDetailClient session={sessionPayload} />
    </AppPage>
  );
}
