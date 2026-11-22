import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import { getBookings } from "@/lib/api/bookings";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Bookings | RentGear" };

const TABS = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function OwnerBookingsPage({ searchParams }) {
  const user = await getSessionUser();
  if (!user?.email) redirect("/sign-in");

  const params = await searchParams;
  const activeTab = TABS.some((tab) => tab.value === params.status)
    ? params.status
    : "all";

  let bookings = [];
  let failed = false;

  try {
    const data = await getBookings({ ownerEmail: user.email });
    bookings = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter(
          (booking) =>
            String(booking.bookingStatus || "").toLowerCase() === activeTab,
        );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          Bookings <span className="text-orange-500">({bookings.length})</span>
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every booking made on your equipment, newest first.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.value === activeTab;
          const href =
            tab.value === "all"
              ? "/dashboard/owner/bookings"
              : `/dashboard/owner/bookings?status=${tab.value}`;

          return (
            <Link
              key={tab.value}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                  : "border-orange-200 bg-white text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {failed && (
        <ErrorCard message="Couldn't load your bookings. Make sure the API server is running and refresh the page." />
      )}

      {!failed && bookings.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="When a customer books one of your listings, it will show up here."
          actionLabel="View my equipment"
          actionHref="/dashboard/owner/equipment"
        />
      )}

      {!failed && bookings.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title={`No ${activeTab} bookings`}
          description="Try another status filter to see more bookings."
          actionLabel="Show all bookings"
          actionHref="/dashboard/owner/bookings"
        />
      )}

      {filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingListCard key={booking._id} booking={booking} showCustomer />
          ))}
        </div>
      )}
    </div>
  );
}
