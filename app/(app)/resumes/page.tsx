import { AppPage } from "@/components/layout/AppPage";
import { ResumesClient } from "@/components/resumes/ResumesClient";
import { listResumesForUser } from "@/services/resume.service";
import { listJobDescriptionsForUser } from "@/services/job-description.service";
import { getAuthUser } from "@/lib/auth";
import { getInterviewConfig } from "@/services/settings.service";

export default async function ResumesPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [resumes, jobDescriptions, interviewConfig] = await Promise.all([
    listResumesForUser(user.id),
    listJobDescriptionsForUser(user.id),
    getInterviewConfig(user.id),
  ]);

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Resumes" },
      ]}
      title="Resumes"
      description="Upload PDFs, review parsed skills and experience, and start interviews."
    >
      <ResumesClient
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
