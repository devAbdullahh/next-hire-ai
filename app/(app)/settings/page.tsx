import { AppPage } from "@/components/layout/AppPage";
import { TrainingContextForm } from "@/components/settings/TrainingContextForm";
import { InterviewConfigForm } from "@/components/settings/InterviewConfigForm";
import { getAuthUser } from "@/lib/auth";
import { getTrainingContext, getInterviewConfig } from "@/services/settings.service";

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [trainingContext, interviewConfig] = await Promise.all([
    getTrainingContext(user.id),
    getInterviewConfig(user.id),
  ]);

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Settings" },
      ]}
      title="Settings"
      description="Customize how the AI interviewer behaves during your mock interviews."
    >
      <div className="space-y-6">
        <InterviewConfigForm initialConfig={interviewConfig} />
        <TrainingContextForm initialContext={trainingContext} />
      </div>
    </AppPage>
  );
}
