import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Package,
  Receipt,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { createBooking } from "@/lib/api/bookings";
import { getGearById } from "@/lib/api/gear";
import { stripe } from "@/lib/stripe";

export const metadata = { title: "Payment Successful | RentGear" };
export const dynamic = "force-dynamic";

function firstImage(gear) {
  return (
    String(gear?.imageUrls || "")
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .find(Boolean) || null
  );
}

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

function ErrorState({ title, message }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg shadow-red-500/5">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <XCircle className="h-9 w-9" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-[#3b2314]">{title}</h1>
      <p className="mt-2 text-sm text-stone-500">{message}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700"
        >
          View My Bookings
        </Link>
        <Link
          href="/equipment"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-200 bg-white px-5 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-600"
        >
          Browse Equipment
        </Link>
      </div>
    </div>
  );
}

export default async function BookingSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId || typeof sessionId !== "string") {
    return (
      <ErrorState
        title="Invalid payment link"
        message="We couldn't find a checkout session. Please open this page from the Stripe confirmation link."
      />
    );
  }

  let checkout;
  try {
    checkout = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Could not retrieve checkout session:", error.message);
    return (
      <ErrorState
        title="Payment not found"
        message="This checkout session is invalid or has expired. If you were charged, please contact support."
      />
    );
  }

  if (checkout.payment_status !== "paid") {
    return (
      <ErrorState
        title="Payment not completed"
        message="This checkout has not been paid yet. Please complete the payment to confirm your booking."
      />
    );
  }

  const meta = checkout.metadata || {};

  let gear = null;
  try {
    gear = await getGearById(meta.equipmentId);
  } catch {
    gear = null;
  }

  const bookingData = {
    equipmentId: meta.equipmentId || "",
    equipmentName: gear?.equipmentName || "Equipment rental",
    image: firstImage(gear) || "",
    ownerEmail: gear?.ownerEmail || "",
    customerEmail:
      checkout.customer_details?.email ||
      checkout.customer_email ||
      meta.customerEmail ||
      "",
    customerName:
      checkout.customer_details?.name ||
      meta.customerName ||
      meta.customerEmail ||
      "",
    startDate: meta.startDate || "",
    endDate: meta.endDate || "",
    quantity: Number(meta.quantity) || 1,
    phone: meta.phone || "",
    address: meta.address || "",
    notes: meta.notes || "",
    totalAmount: (checkout.amount_total ?? 0) / 100,
    currency: checkout.currency || "usd",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    stripeSessionId: checkout.id,
    createdAt: new Date().toISOString(),
  };

  let booking = null;
  let saveFailed = false;

  try {
    const result = await createBooking(bookingData);
    booking = result?.booking || null;
  } catch (error) {
    saveFailed = true;
    console.error("Could not save booking:", error.message);
  }

  const bookingId = String(booking?._id || checkout.id)
    .slice(-10)
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-500/10 sm:p-9">
        <div className="text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-11 w-11" />
            </span>
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[#3b2314] sm:text-3xl">
            Payment Successful
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Your booking is confirmed. A receipt has been sent to your email.
          </p>
        </div>

        {saveFailed && (
          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Your payment went through, but we couldn&apos;t save the booking
              automatically. Please contact support with session ID{" "}
              <strong>{checkout.id}</strong>.
            </p>
          </div>
        )}

        <div className="mt-7 overflow-hidden rounded-2xl border border-orange-100">
          <div className="flex items-center gap-3 border-b border-orange-100 bg-orange-50/60 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
              {bookingData.image ? (
                <img
                  src={bookingData.image}
                  alt={bookingData.equipmentName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-orange-300">
                  <Package className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-[#3b2314]">
                {bookingData.equipmentName}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Confirmed
              </span>
            </div>
          </div>

          <dl className="divide-y divide-orange-50 text-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-stone-500">
                <CalendarDays className="h-4 w-4 text-orange-400" />
                Rental dates
              </dt>
              <dd className="text-right font-semibold text-[#3b2314]">
                {formatDate(bookingData.startDate)} –{" "}
                {formatDate(bookingData.endDate)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-stone-500">
                <Package className="h-4 w-4 text-orange-400" />
                Quantity
              </dt>
              <dd className="font-semibold text-[#3b2314]">
                {bookingData.quantity} unit(s)
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-stone-500">
                <Receipt className="h-4 w-4 text-orange-400" />
                Total paid
              </dt>
              <dd className="text-lg font-extrabold text-orange-600">
                {formatMoney(bookingData.totalAmount, bookingData.currency)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-stone-500">Booking ID</dt>
              <dd className="font-mono text-xs font-semibold text-[#3b2314]">
                #{bookingId}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700 active:translate-y-px"
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/equipment"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-orange-200 bg-white px-5 text-sm font-semibold text-stone-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            Browse More Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
