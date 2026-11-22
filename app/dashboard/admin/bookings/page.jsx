import { CalendarCheck } from "lucide-react";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import { getAllBookingsAdmin } from "@/lib/api/bookings";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Bookings | RentGear" };

export default async function AdminBookingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  let bookings = [];
  let failed = false;

  try {
    const data = await getAllBookingsAdmin();
    bookings = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          All Bookings{" "}
          <span className="text-orange-500">({bookings.length})</span>
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every booking made on the platform, newest first.
        </p>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load platform bookings. Check that ADMIN_SETUP_KEY is set in both the API server and this app, then refresh." />
      )}

      {!failed && bookings.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Platform bookings will appear here once customers start renting."
        />
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingListCard key={booking._id} booking={booking} showCustomer />
          ))}
        </div>
      )}
    </div>
  );
}
