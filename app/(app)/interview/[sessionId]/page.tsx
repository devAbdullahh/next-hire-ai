import { redirect } from "next/navigation";
import { AppPage } from "@/components/layout/AppPage";
import { VoiceInterview } from "@/components/interview/VoiceInterview";
import { getSession } from "@/services/interview.service";
import { getResumeById } from "@/services/resume.service";
import { getAuthUser } from "@/lib/auth";
import { isValidAvatarId } from "@/lib/interviewer-avatars";
import type { InterviewerAvatarId } from "@/types";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function LiveInterviewPage({ params }: PageProps) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { sessionId } = await params;
  const session = await getSession(sessionId, user.id);

  if (!session) redirect("/interviews");
  if (session.status === "completed") redirect(`/interviews/${sessionId}`);

  const resume = await getResumeById(session.resumeId.toString(), user.id);
  const resumeName = resume?.fileName ?? "Interview";

  const openingMessage =
    session.messages.find((m) => m.role === "ai")?.content ??
    "Let's begin your interview.";

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Interviews", href: "/interviews" },
        { label: resumeName, href: `/interviews/${sessionId}` },
        { label: "Live" },
      ]}
      title={session.jobTitle ? `Live · ${session.jobTitle}` : "Live interview"}
      description={
        session.jobTitle
          ? "Role-targeted interview — questions cross-reference your resume with the job description."
          : "Speak or type your answers. Your avatar adapts based on your resume and performance."
      }
    >
      <VoiceInterview
        sessionId={sessionId}
        openingMessage={openingMessage}
        maxQuestions={session.maxQuestions ?? 8}
        jobTitle={session.jobTitle}
        interviewerAvatarId={
          (isValidAvatarId(session.interviewerAvatarId ?? "")
            ? session.interviewerAvatarId
            : "monica") as InterviewerAvatarId
        }
      />
    </AppPage>
  );
}
