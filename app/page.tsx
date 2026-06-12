import { LandingPage } from "@/components/marketing/LandingPage";
import { getAuthUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getAuthUser();
  return <LandingPage user={user} />;
}
