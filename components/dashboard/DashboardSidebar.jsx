"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Package,
  PackagePlus,
  Settings,
  UserRound,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const menus = {
  customer: [
    { label: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
    { label: "Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  owner: [
    { label: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "My Equipment", href: "/dashboard/owner/equipment", icon: Package },
    { label: "Add Equipment", href: "/dashboard/owner/equipment/add", icon: PackagePlus },
    { label: "Bookings", href: "/dashboard/owner/bookings", icon: CalendarCheck },
    { label: "Earnings", href: "/dashboard/owner/earnings", icon: Wallet },
    { label: "Profile", href: "/dashboard/owner/profile", icon: UserRound },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Equipment", href: "/dashboard/admin/equipment", icon: Package },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

function DashboardAvatar({ user }) {
  const [failed, setFailed] = useState(false);
  const label = user.name || user.email || "User";

  return (
    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-xl font-bold text-white ring-2 ring-orange-500 ring-offset-2 ring-offset-[#2b1a12]">
      {user.image && !failed ? (
        <img
          src={user.image}
          alt={label}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        label.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const items = menus[user.role] ?? menus.customer;

  const handleSignOut = async () => {
    setOpenMobile(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-900/40">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-white">
            Rent<span className="text-orange-500">Gear</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

      <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
        <DashboardAvatar user={user} />
        <p className="w-full truncate text-sm font-semibold text-white">
          {user.name || user.email}
        </p>
        <p className="text-xs capitalize tracking-wide text-orange-200/70">
          {user.role}
        </p>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                    isActive={pathname === item.href}
                    className={cn(
                      "h-11 gap-3 rounded-full px-4 text-[0.95rem] font-medium text-orange-50/70 transition-colors hover:bg-white/10 hover:text-white",
                      pathname === item.href &&
                        "bg-orange-500 text-white shadow-lg shadow-orange-900/40 hover:bg-orange-500 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-11 gap-3 rounded-full px-4 text-[0.95rem] font-medium text-orange-50/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
