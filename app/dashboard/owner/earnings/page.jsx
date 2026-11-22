import { CalendarDays, Receipt, TrendingUp, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import StatCard from "@/components/dashboard/StatCard";
import { getBookings } from "@/lib/api/bookings";
import { formatDate, formatMoney, monthKey } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Earnings | RentGear" };

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1),
    );
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
    };
  });
}

export default async function OwnerEarningsPage() {
  const user = await getSessionUser();
  if (!user?.email) redirect("/sign-in");

  let bookings = [];
  let failed = false;

  try {
    const data = await getBookings({ ownerEmail: user.email });
    bookings = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  const paid = bookings.filter(
    (booking) => String(booking.paymentStatus || "").toLowerCase() === "paid",
  );

  const total = paid.reduce(
    (sum, booking) => sum + (Number(booking.totalAmount) || 0),
    0,
  );

  const months = lastSixMonths();
  const thisMonthKey = months[months.length - 1].key;

  const thisMonth = paid
    .filter((booking) => monthKey(booking.createdAt) === thisMonthKey)
    .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);

  const chart = months.map((month) => ({
    ...month,
    amount: paid
      .filter((booking) => monthKey(booking.createdAt) === month.key)
      .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0),
  }));

  const maxAmount = Math.max(...chart.map((month) => month.amount), 1);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          Earnings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Paid bookings on your equipment and how your income is trending.
        </p>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load your earnings. Make sure the API server is running and refresh the page." />
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total Earnings"
          value={formatMoney(total, "USD")}
          hint="All paid bookings"
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={formatMoney(thisMonth, "USD")}
          hint={months[months.length - 1].label}
        />
        <StatCard
          icon={Receipt}
          label="Paid Transactions"
          value={paid.length}
          hint="Completed payments"
        />
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 sm:p-6">
        <h2 className="flex items-center gap-2 font-bold text-[#3b2314]">
          <TrendingUp className="h-4 w-4 text-orange-500" />
          Last 6 Months
        </h2>

        <div className="mt-6 flex h-48 items-end justify-between gap-2 sm:gap-4">
          {chart.map((month) => {
            const height =
              month.amount === 0
                ? 4
                : Math.max(8, Math.round((month.amount / maxAmount) * 100));

            return (
              <div
                key={month.key}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-semibold text-stone-500 sm:text-xs">
                  {month.amount > 0 ? formatMoney(month.amount, "USD") : "—"}
                </span>
                <div
                  className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-orange-600 to-orange-400 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${month.label}: ${formatMoney(month.amount, "USD")}`}
                />
                <span className="text-xs font-medium text-stone-500">
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#3b2314]">
          <Receipt className="h-5 w-5 text-orange-500" />
          Paid Transactions
        </h2>

        {!failed && paid.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No paid bookings yet"
            description="Once a customer pays for one of your listings, the transaction will appear here."
            actionLabel="View my equipment"
            actionHref="/dashboard/owner/equipment"
          />
        ) : (
          paid.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-900/5">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-orange-100 bg-orange-50/60 text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Equipment</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Booked On</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {paid.map((booking) => (
                    <tr key={booking._id} className="hover:bg-orange-50/40">
                      <td className="max-w-[240px] truncate px-4 py-3 font-semibold text-[#3b2314]">
                        {booking.equipmentName || "Equipment rental"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {booking.customerName ||
                          booking.customerEmail ||
                          "Customer"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-orange-600">
                        {formatMoney(booking.totalAmount, booking.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
    </div>
  );
}
