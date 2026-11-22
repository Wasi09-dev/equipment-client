import { CalendarDays, ExternalLink, Package, UserRound } from "lucide-react";
import Link from "next/link";
import { formatDate, formatMoney } from "@/lib/format";

const statusStyles = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-600",
};

export default function BookingListCard({ booking, showCustomer = false }) {
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

          {showCustomer && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 sm:text-sm">
              <span className="inline-flex items-center gap-1 font-medium text-stone-600">
                <UserRound className="h-3.5 w-3.5 text-orange-400" />
                {booking.customerName || "Customer"}
              </span>
              {booking.customerEmail && (
                <span className="max-w-full truncate text-stone-500">
                  {booking.customerEmail}
                </span>
              )}
            </div>
          )}

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

        {booking.equipmentId && (
          <div className="flex shrink-0 items-center self-end sm:self-center">
            <Link
              href={`/equipment/${booking.equipmentId}`}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              View Equipment
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
