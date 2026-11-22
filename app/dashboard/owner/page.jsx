import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Package,
  Plus,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import StatCard from "@/components/dashboard/StatCard";
import { getBookings, getOwnerStats } from "@/lib/api/bookings";
import { getGear } from "@/lib/api/gear";
import { formatMoney } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Owner Dashboard | RentGear" };

function firstImage(gear) {
  return (
    String(gear.imageUrls || "")
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .find(Boolean) || null
  );
}

export default async function OwnerDashboardPage() {
  const user = await getSessionUser();
  if (!user?.email) redirect("/sign-in");

  let stats = {
    totalEquipment: 0,
    totalBookings: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
  };
  let gear = [];
  let bookings = [];
  let failed = false;

  try {
    const [statsData, gearData, bookingsData] = await Promise.all([
      getOwnerStats(user.email),
      getGear(`?ownerEmail=${encodeURIComponent(user.email)}`),
      getBookings({ ownerEmail: user.email }),
    ]);

    stats = { ...stats, ...statsData };
    gear = Array.isArray(gearData) ? gearData : [];
    bookings = Array.isArray(bookingsData) ? bookingsData : [];
  } catch {
    failed = true;
  }

  const recentBookings = bookings.slice(0, 5);

  const bookingCounts = new Map();
  bookings.forEach((booking) => {
    if (String(booking.bookingStatus || "").toLowerCase() === "cancelled") {
      return;
    }
    const key = String(booking.equipmentId || "");
    if (!key) return;
    bookingCounts.set(key, (bookingCounts.get(key) || 0) + 1);
  });

  const topEquipment = gear
    .map((item) => ({
      ...item,
      bookingCount: bookingCounts.get(String(item._id)) || 0,
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            Welcome back, {user.name || "Owner"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Here is how your equipment and bookings are doing.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/dashboard/owner/equipment/add"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            Add Equipment
          </Link>
          <Link
            href="/dashboard/owner/bookings"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            View Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load your dashboard data. Make sure the API server is running and refresh the page." />
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Equipment"
          value={stats.totalEquipment ?? 0}
        />
        <StatCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={stats.totalBookings ?? 0}
        />
        <StatCard
          icon={Wallet}
          label="Total Earnings"
          value={formatMoney(stats.totalEarnings, "USD")}
        />
        <StatCard
          icon={Clock}
          label="Upcoming Bookings"
          value={stats.upcomingBookings ?? 0}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#3b2314]">Recent Bookings</h2>
          <Link
            href="/dashboard/owner/bookings"
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
            description="When customers book your equipment, their bookings will appear here."
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

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#3b2314]">
            Your Top Equipment
          </h2>
          <Link
            href="/dashboard/owner/equipment"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Manage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {topEquipment.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No equipment added yet"
            description="Add your first machine or tool and start earning from rentals."
            actionLabel="Add your first equipment"
            actionHref="/dashboard/owner/equipment/add"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {topEquipment.map((item) => {
              const image = firstImage(item);
              return (
                <Link
                  key={item._id}
                  href={`/equipment/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10"
                >
                  <div className="h-28 w-full bg-orange-50">
                    {image ? (
                      <img
                        src={image}
                        alt={item.equipmentName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-orange-300">
                        <Package className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-bold text-[#3b2314]">
                      {item.equipmentName}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {item.bookingCount} booking
                      {item.bookingCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
