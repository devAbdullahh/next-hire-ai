import { AppPage } from "@/components/layout/AppPage";
import { TargetRolesClient } from "@/components/target-roles/TargetRolesClient";
import { getAuthUser } from "@/lib/auth";
import { toPlain } from "@/lib/serialize";
import { listJobDescriptionsForUser } from "@/services/job-description.service";

export default async function TargetRolesPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const items = await listJobDescriptionsForUser(user.id);

  const jobDescriptions = toPlain(
    items.map((jd) => ({
      id: jd._id.toString(),
      title: jd.title,
      company: jd.company,
      rawText: jd.rawText,
      createdAt: jd.createdAt.toISOString(),
    }))
  );

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Target roles" },
      ]}
      title="Target roles"
      description="Save job descriptions and practice interviews tailored to specific roles you're applying for."
    >
      <TargetRolesClient initialJobDescriptions={jobDescriptions} />
    </AppPage>
  );
}
