import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import RoleGuard from "@/components/dashboard/RoleGuard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role ?? "customer",
  };

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset className="bg-gradient-to-b from-orange-50/70 via-background to-orange-50/40">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-orange-100 bg-white/70 px-3 backdrop-blur sm:gap-3 sm:px-4">
          <SidebarTrigger className="shrink-0 text-orange-600 hover:bg-orange-50" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-stone-900">
              {user.name || user.email}
            </p>
            <p className="truncate text-xs capitalize text-stone-500">
              {user.role} dashboard
            </p>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
      <RoleGuard role={user.role} />
    </SidebarProvider>
  );
}
