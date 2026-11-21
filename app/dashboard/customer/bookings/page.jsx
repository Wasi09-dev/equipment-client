import {
  CalendarCheck,
  CalendarDays,
  ExternalLink,
  Package,
  ShoppingBag,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyBookings } from "@/lib/api/bookings";
import { auth } from "@/lib/auth";

export const metadata = { title: "My Bookings | RentGear" };
export const dynamic = "force-dynamic";

const statusStyles = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-600",
};

function formatDate(value) {
  if (!value) return "—";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMoney(amount, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase(),
  }).format(Number(amount) || 0);
}

function BookingCard({ booking }) {
  const status = String(booking.bookingStatus || "pending");
  const statusKey = status.toLowerCase();

  return (
    <article className="group rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-orange-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          {booking.image ? (
            <img
              src={booking.image}
              alt={booking.equipmentName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-300">
              <Package className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 sm:text-lg">
              {booking.equipmentName || "Equipment rental"}
            </h2>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                statusStyles[statusKey] ??
                "border-orange-200 bg-orange-50 text-orange-600"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
              {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
            </span>
            <span className="text-orange-200">•</span>
            <span>Qty: {booking.quantity ?? 1}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <p className="font-bold text-orange-500">
              {formatMoney(booking.totalAmount, booking.currency)}
            </p>
            <span className="hidden text-orange-200 sm:inline">•</span>
            <p className="text-xs text-stone-500">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center self-end sm:self-center">
          <Link
            href={`/equipment/${booking.equipmentId}`}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            View Equipment
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function MyBookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  if (!email) {
    redirect("/sign-in");
  }

  let bookings = [];
  let failed = false;

  try {
    const data = await getMyBookings(email);
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
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5 text-sm">
          <p className="font-semibold text-red-600">
            Couldn&apos;t load your bookings.
          </p>
          <p className="mt-1 text-red-500">
            Make sure the API server is running on{" "}
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"} and
            refresh the page.
          </p>
        </div>
      )}

      {!failed && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <CalendarCheck className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-stone-900">
            No bookings yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Rent your first machine or tool and it will show up here.
          </p>
          <Link
            href="/equipment"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Equipment
          </Link>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
