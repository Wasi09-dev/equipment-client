"use client";

import { CalendarDays, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";

const inputClass =
  "h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#3b2314]";

const toInputDate = (date) => date.toISOString().split("T")[0];

export default function BookingCard({ id, price, rentalType, stock }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toInputDate(d);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return toInputDate(d);
  });
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  const type = String(rentalType || "daily").toLowerCase();
  const unitName =
    { daily: "day", weekly: "week", monthly: "month" }[type] || "day";

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(
    1,
    Math.ceil((new Date(endDate) - new Date(startDate)) / msPerDay),
  );

  const units =
    type === "weekly"
      ? Math.ceil(days / 7)
      : type === "monthly"
        ? Math.ceil(days / 30)
        : days;

  const total = units * Number(price) * Number(quantity || 1);

  const showError = (title, description) => {
    toast.add({ type: "error", title, description });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isPending) return;

    if (!user) {
      toast.add({
        type: "info",
        title: "Please sign in",
        description: "You need an account to book equipment.",
      });
      router.push("/sign-in");
      return;
    }

    if ((user.role ?? "customer") !== "customer") {
      showError(
        "Only customers can book equipment",
        "Owners and admins cannot place bookings.",
      );
      return;
    }

    if (endDate < startDate) {
      showError(
        "Invalid dates",
        "The end date must be on or after the start date.",
      );
      return;
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      showError("Invalid quantity", "Please choose at least 1 unit.");
      return;
    }

    if (qty > stock) {
      showError("Not enough stock", `Only ${stock} unit(s) are available.`);
      return;
    }

    if (!phone.trim() || !address.trim()) {
      showError(
        "Missing details",
        "Phone number and delivery address are required.",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: id,
          startDate,
          endDate,
          quantity: qty,
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        throw new Error(
          data.error || "Could not start checkout. Please try again.",
        );
      }

      window.location.href = data.url;
    } catch (error) {
      showError("Checkout failed", error.message);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-24 space-y-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-500/10"
    >
      <div className="flex items-center justify-between">
        <p className="text-3xl font-extrabold text-orange-600">
          ৳{price}
          <span className="ml-1 text-sm font-medium text-stone-500">
            / {type}
          </span>
        </p>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Instant Checkout
        </span>
      </div>

      <div>
        <label htmlFor="booking-start-date" className={labelClass}>
          Rental Start Date
        </label>
        <input
          id="booking-start-date"
          type="date"
          required
          min={toInputDate(new Date())}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-end-date" className={labelClass}>
          Rental End Date
        </label>
        <input
          id="booking-end-date"
          type="date"
          required
          min={startDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-quantity" className={labelClass}>
          Quantity (Max: {stock})
        </label>
        <input
          id="booking-quantity"
          type="number"
          required
          min="1"
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-phone" className={labelClass}>
          Contact Phone
        </label>
        <input
          id="booking-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+880 1700 000000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-address" className={labelClass}>
          Delivery Address
        </label>
        <input
          id="booking-address"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House/Plot, Road, Area, City"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-notes" className={labelClass}>
          Special Instructions (Optional)
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Delivery instructions, operator needed, etc."
          className="w-full rounded-xl border border-orange-200 bg-white p-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div className="space-y-2 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-orange-500" />
            {units} {unitName}
            {units > 1 ? "s" : ""} × ৳{price} × {quantity || 1}
          </span>
          <span>৳{total}</span>
        </div>
        <div className="flex items-center justify-between border-t border-orange-100 pt-2 font-bold text-[#3b2314]">
          <span>Total Due</span>
          <span className="text-xl text-orange-600">৳{total}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || isPending || stock <= 0}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {stock > 0 ? "Book & Pay with Stripe" : "Out of Stock"}
          </>
        )}
      </button>
    </form>
  );
}
