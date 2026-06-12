import { AppPage } from "@/components/layout/AppPage";
import { AvatarsClient } from "@/components/avatars/AvatarsClient";
import { getAuthUser } from "@/lib/auth";

export default async function AvatarsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  return (
    <AppPage
      breadcrumbs={[
        { label: "Overview", href: "/dashboard" },
        { label: "Avatars" },
      ]}
      title="Avatars"
      description="Browse our interview avatars — each has a distinct voice and personality."
    >
      <AvatarsClient />
    </AppPage>
  );
}
