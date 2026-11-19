"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const roleRoutes = ["admin", "customer", "owner"];

export default function RoleGuard({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const segment = pathname.split("/")[2];
    if (roleRoutes.includes(segment) && segment !== role) {
      router.replace(`/dashboard/${role}`);
    }
  }, [pathname, role, router]);

  return null;
}
