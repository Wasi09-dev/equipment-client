import Link from "next/link";
import { FolderOpen, MapPin, Package } from "lucide-react";

function firstImage(gear) {
  return (
    String(gear.imageUrls || "")
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .find(Boolean) || null
  );
}

export default function GearCard({ gear }) {
  const image = firstImage(gear);
  const inStock = Number(gear.quantity) > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 w-full bg-stone-100">
        {image ? (
          <img
            src={image}
            alt={gear.equipmentName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-300">
            <Package className="h-10 w-10" />
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            inStock ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {inStock ? "Available" : "Out of stock"}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <h2 className="text-lg font-bold text-[#3b2314]">
          {gear.equipmentName}
        </h2>

        {gear.category && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">
            <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
            {gear.category}
          </span>
        )}

        <p className="flex items-center gap-1.5 text-sm text-stone-500">
          <MapPin className="h-4 w-4 text-orange-500" />
          {gear.location || "Location not set"}
        </p>

        <div className="space-y-3 border-t border-stone-100 pt-4">
          <p className="text-xl font-bold text-orange-600 whitespace-nowrap">
            ${gear.rentalPrice}
            <span className="ml-1 text-sm font-medium text-stone-500">
              / {String(gear.rentalType || "daily").toLowerCase()}
            </span>
          </p>

          <Link
            href={`/equipment/${gear._id}`}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-lg active:scale-[0.98]"
          >
            View Details
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}