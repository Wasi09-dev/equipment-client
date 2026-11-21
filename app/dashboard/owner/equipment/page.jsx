import Link from "next/link";
import {
  CalendarCheck,
  ExternalLink,
  MapPin,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import { getGear } from "@/lib/api/gear";
import DeleteEquipmentButton from "@/components/dashboard/DeleEquipmentButton";

export const metadata = {
  title: "My Equipment | RentGear",
  description: "Manage your equipment listings, pricing, and stock.",
};

const statusStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-red-200 bg-red-50 text-red-600",
};

function firstImage(gear) {
  return (
    String(gear.imageUrls || "")
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .find(Boolean) || null
  );
}

function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString("en-US") : value;
}

function EquipmentCard({ gear }) {
  const image = firstImage(gear);
  const stock = Number(gear.quantity);
  const status = gear.status || "Approved";
  const statusKey = String(status).toLowerCase();

  return (
    <article className="group rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-orange-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          {image ? (
            <img
              src={image}
              alt={gear.equipmentName}
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
              {gear.equipmentName}
            </h2>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                statusStyles[statusKey] ??
                "border-orange-200 bg-orange-50 text-orange-600"
              }`}
            >
              {status}
            </span>
            {gear.category && (
              <span className="rounded-full border border-orange-200 bg-orange-50/60 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                {gear.category}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-orange-400" />
              {gear.location || "Location not set"}
            </span>
            <span className="text-orange-200">•</span>
            <span>Brand: {gear.brand || "—"}</span>
            <span className="text-orange-200">•</span>
            <span>Model: {gear.model || "—"}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <p className="font-bold text-orange-500">
              ${formatPrice(gear.rentalPrice)}
              <span className="ml-1 text-xs font-medium text-stone-500">
                / {String(gear.rentalType || "day").toLowerCase()}
              </span>
            </p>
            <span className="hidden text-orange-200 sm:inline">•</span>
            <p
              className={`font-semibold ${
                Number.isFinite(stock) && stock > 0
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              Available Stock: {gear.quantity ?? 0} units
            </p>
          </div>
        </div>
<div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
  <Link
   href={`/equipment/${gear._id}`}
    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
  >
    View
    <ExternalLink className="h-3.5 w-3.5" />
  </Link>

  <Link
    href={`/dashboard/owner/equipment/${gear._id}/edit`}
    aria-label={`Edit ${gear.equipmentName}`}
    title="Edit equipment"
    className="grid size-9 shrink-0 place-items-center rounded-lg border border-orange-200 bg-white text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
  >
    <Pencil className="h-4 w-4" />
  </Link>

  <DeleteEquipmentButton id={gear._id} name={gear.equipmentName} />
</div>
      </div>
    </article>
  );
}

export default async function MyEquipmentPage() {
  let gear = [];
  let failed = false;

  try {
    const data = await getGear();
    gear = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            Your Equipment Listings{" "}
            <span className="text-orange-500">({gear.length})</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Update rental prices, stock inventory, and review admin approval
            status
          </p>
        </div>

        <Link
          href="/dashboard/owner/equipment/add"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Equipment
        </Link>
      </section>

      {failed && (
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5 text-sm">
          <p className="font-semibold text-red-600">
            Couldn&apos;t load your equipment.
          </p>
          <p className="mt-1 text-red-500">
            Make sure the API server is running on{" "}
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"} and
            refresh the page.
          </p>
        </div>
      )}

      {!failed && gear.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <CalendarCheck className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-stone-900">
            No equipment listed yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Add your first machine or tool and start earning from rentals.
          </p>
          <Link
            href="/dashboard/owner/equipment/add"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add Equipment
          </Link>
        </div>
      )}

      {gear.length > 0 && (
        <div className="space-y-4">
          {gear.map((item) => (
            <EquipmentCard key={item._id} gear={item} />
          ))}
        </div>
      )}
    </div>
  );
}
