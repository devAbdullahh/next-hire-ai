import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { AppShell } from "./AppShell";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface AppPageProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
}

export async function AppPage({
  children,
  breadcrumbs,
  title,
  description,
}: AppPageProps) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <AppShell
      user={user}
      breadcrumbs={breadcrumbs}
      title={title}
      description={description}
    >
      {children}
    </AppShell>
  );
}
