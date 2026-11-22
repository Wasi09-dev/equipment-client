import { Database, KeyRound, Server, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Settings | RentGear" };

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-orange-50 py-3 last:border-0">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="truncate text-sm font-semibold text-[#3b2314]">
        {value}
      </span>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-stone-900 sm:text-2xl">
          <Settings className="h-5 w-5 text-orange-500" />
          Settings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Platform configuration overview for administrators.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold text-[#3b2314]">
            <Server className="h-4 w-4 text-orange-500" />
            API Server
          </h2>
          <div className="mt-3">
            <InfoRow label="Base URL" value={apiUrl} />
            <InfoRow label="Environment" value={process.env.NODE_ENV} />
          </div>
        </section>

        <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold text-[#3b2314]">
            <Database className="h-4 w-4 text-orange-500" />
            Data
          </h2>
          <div className="mt-3">
            <InfoRow label="Database" value="equipmentdb" />
            <InfoRow label="Collections" value="user, gear, bookings" />
          </div>
        </section>

        <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 sm:p-6 md:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-[#3b2314]">
            <KeyRound className="h-4 w-4 text-orange-500" />
            Admin Setup Key
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            One-time maintenance routes such as assigning legacy owners and
            backfilling bookings are protected by{" "}
            <code className="rounded bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-700">
              ADMIN_SETUP_KEY
            </code>
            . Keep this key private and rotate it after the migration is done.
          </p>
          <div className="mt-3">
            <InfoRow
              label="Key configured"
              value={process.env.ADMIN_SETUP_KEY ? "Yes" : "No"}
            />
          </div>
        </section>
      </div>

      <p className="rounded-2xl border border-dashed border-orange-200 bg-white/70 px-5 py-4 text-sm text-stone-500">
        More settings, such as category management and payout preferences, are
        coming soon.
      </p>
    </div>
  );
}
