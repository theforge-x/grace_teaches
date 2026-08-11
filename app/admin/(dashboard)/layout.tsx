import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getServerSession } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
}
