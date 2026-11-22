import { CalendarCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingListCard from "@/components/dashboard/BookingListCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import { getMyBookings } from "@/lib/api/bookings";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "My Bookings | RentGear" };
export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
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

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            My Bookings{" "}
            <span className="text-orange-500">({bookings.length})</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Track your rentals, payment status, and upcoming delivery dates.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px sm:w-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Equipment
        </Link>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load your bookings. Make sure the API server is running and refresh the page." />
      )}

      {!failed && bookings.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Rent your first machine or tool and it will show up here."
          actionLabel="Browse equipment"
          actionHref="/equipment"
        />
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingListCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
