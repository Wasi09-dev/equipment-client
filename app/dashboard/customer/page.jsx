import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import StatCard from "@/components/dashboard/StatCard";
import { getMyBookings } from "@/lib/api/bookings";
import { formatMoney } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Customer Dashboard | RentGear" };

function isActiveOrUpcoming(booking) {
  const status = String(booking.bookingStatus || "").toLowerCase();
  if (status === "cancelled" || status === "completed") return false;

  const raw = booking.endDate;
  const end = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T23:59:59Z`)
    : new Date(raw);
  if (Number.isNaN(end.getTime())) return status === "confirmed";

  return end.getTime() >= Date.now();
}

export default async function CustomerDashboardPage() {
  const user = await getSessionUser();
  if (!user?.email) redirect("/sign-in");

  let bookings = [];
  let failed = false;

  try {
    const data = await getMyBookings(user.email);
    bookings = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  const activeUpcoming = bookings.filter(isActiveOrUpcoming).length;

  const totalSpent = bookings
    .filter(
      (booking) => String(booking.paymentStatus || "").toLowerCase() === "paid",
    )
    .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            Welcome back, {user.name || "there"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Here is a quick look at your rentals and spending.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Equipment
        </Link>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load your dashboard data. Make sure the API server is running and refresh the page." />
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={bookings.length}
        />
        <StatCard
          icon={CalendarClock}
          label="Active / Upcoming"
          value={activeUpcoming}
        />
        <StatCard
          icon={Wallet}
          label="Total Spent"
          value={formatMoney(totalSpent, "USD")}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#3b2314]">Recent Bookings</h2>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!failed && recentBookings.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No bookings yet"
            description="Browse the catalog and rent your first machine or tool."
            actionLabel="Browse equipment"
            actionHref="/equipment"
          />
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingListCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
