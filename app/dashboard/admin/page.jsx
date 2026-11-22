import {
  ArrowRight,
  CalendarCheck,
  Package,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import StatCard from "@/components/dashboard/StatCard";
import { getAllBookingsAdmin } from "@/lib/api/bookings";
import { getGear } from "@/lib/api/gear";
import { getUsers } from "@/lib/api/users";
import { formatMoney } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Admin Dashboard | RentGear" };

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const [usersResult, gearResult, bookingsResult] = await Promise.allSettled([
    getUsers(),
    getGear(),
    getAllBookingsAdmin(),
  ]);

  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const gear = gearResult.status === "fulfilled" ? gearResult.value : [];
  const bookings =
    bookingsResult.status === "fulfilled" ? bookingsResult.value : [];

  const failed =
    usersResult.status === "rejected" ||
    gearResult.status === "rejected" ||
    bookingsResult.status === "rejected";

  const revenue = bookings
    .filter(
      (booking) => String(booking.paymentStatus || "").toLowerCase() === "paid",
    )
    .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          Admin Overview
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Platform activity across users, equipment and bookings.
        </p>
      </section>

      {failed && (
        <ErrorCard message="Some admin data could not be loaded. Check that the API server is running and ADMIN_SETUP_KEY is set on both the server and this app." />
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={users.length} />
        <StatCard icon={Package} label="Total Equipment" value={gear.length} />
        <StatCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={bookings.length}
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatMoney(revenue, "USD")}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/dashboard/admin/users",
            label: "Manage Users",
            description: "View all registered accounts and roles.",
            icon: Users,
          },
          {
            href: "/dashboard/admin/equipment",
            label: "Review Equipment",
            description: "Browse every listing and its owner.",
            icon: Package,
          },
          {
            href: "/dashboard/admin/bookings",
            label: "View Bookings",
            description: "See all platform bookings and payments.",
            icon: CalendarCheck,
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-orange-50 text-orange-500">
              <item.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 flex items-center gap-1 font-bold text-[#3b2314]">
              {item.label}
              <ArrowRight className="h-4 w-4 text-orange-400 transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-1 text-sm text-stone-500">{item.description}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#3b2314]">Recent Bookings</h2>
          <Link
            href="/dashboard/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings yet"
            description="Platform bookings will appear here once customers start renting."
          />
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingListCard
                key={booking._id}
                booking={booking}
                showCustomer
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
