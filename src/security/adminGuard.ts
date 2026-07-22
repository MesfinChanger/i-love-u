import { redirect } from "next/navigation";
import { getUserRole } from "@/server/getUserRole";

/**
 * @fileOverview Sovereign Admin Guard.
 * Orchestrates server-side authority verification.
 */
export async function requireAdmin(uid: string) {
  if (!uid || uid === "CURRENT_USER_ID") {
    redirect("/login");
  }

  const role = await getUserRole(uid);

  if (role !== "admin" && role !== "system_owner") {
    // Redirect to home if authority is not recognized
    redirect("/");
  }

  return true;
}
