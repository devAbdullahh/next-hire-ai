import { clearAuthCookie } from "@/lib/auth";
import { jsonOk } from "@/lib/api";

export async function POST() {
  await clearAuthCookie();
  return jsonOk({ message: "Logged out" });
}
