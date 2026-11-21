import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Package, User } from "lucide-react";
import { getGearById } from "@/lib/api/gear";
import BookingCard from "@/components/BookingCard";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const gear = await getGearById(id).catch(() => null);
  return { title: gear ? `${gear.equipmentName} | RentGear` : "Equipment | RentGear" };
}

function getImages(gear) {
  return String(gear.imageUrls || "")
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function Spec({ label, value, highlight }) {
  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className={`mt-1 text-sm font-bold ${highlight ? "text-orange-600" : "text-[#3b2314]"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export default async function EquipmentDetails({ params }) {
  const { id } = await params;

  let gear = null;
  try {
    gear = await getGearById(id);
  } catch {
    gear = null;
  }
  if (!gear) notFound();

  const images = getImages(gear);
  const stock = Number(gear.quantity) || 0;
  const type = String(gear.rentalType || "Daily");

  return (
    <div className="bg-[#faf6f1]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <Link
          href="/equipment"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all equipment
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          <div className="space-y-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
          
            <div className="h-64 w-full overflow-hidden rounded-2xl bg-orange-50 sm:h-96">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={gear.equipmentName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-orange-300">
                  <Package className="h-14 w-14" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-20 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

           
            <div>
              <div className="flex flex-wrap gap-2">
                {gear.category && (
                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {gear.category}
                  </span>
                )}
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    stock > 0
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {stock > 0 ? `Available (${stock} in stock)` : "Out of stock"}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {type} Rental
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold text-[#3b2314] sm:text-4xl">
                {gear.equipmentName}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                <MapPin className="h-4 w-4 text-orange-500" />
                {gear.location || "Location not set"}
              </p>
            </div>

            <hr className="border-orange-100" />

            <section>
              <h2 className="mb-2 font-bold text-[#3b2314]">Description</h2>
              <p className="text-sm leading-relaxed text-stone-600">
                {gear.description || "No description provided."}
              </p>
            </section>

            <hr className="border-orange-100" />

            <section>
              <h2 className="mb-3 font-bold text-[#3b2314]">Specifications</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Spec label="Brand" value={gear.brand} />
                <Spec label="Model" value={gear.model} />
                <Spec label="Condition" value={gear.condition} />
                <Spec label="Available Stock" value={`${stock} units`} />
                <Spec
                  label="Rental Rate"
                  value={`৳${gear.rentalPrice} / ${type.toLowerCase()}`}
                  highlight
                />
                <Spec label="Rental Type" value={type} />
              </div>
            </section>

            <hr className="border-orange-100" />

            <section>
              <h2 className="mb-3 font-bold text-[#3b2314]">Owner & Supplier</h2>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-orange-100 text-orange-500">
                    <User className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#3b2314]">
                      {gear.ownerName || "Equipment Owner"}
                    </p>
                    {gear.ownerEmail && (
                      <p className="flex items-center gap-1 text-xs text-stone-500">
                        <Mail className="h-3 w-3" />
                        {gear.ownerEmail}
                      </p>
                    )}
                  </div>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Verified Owner
                </span>
              </div>
            </section>

            <hr className="border-orange-100" />

            <section>
              <h2 className="mb-3 font-bold text-[#3b2314]">Rental Terms & Conditions</h2>
              <p className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 text-sm text-stone-600">
                {gear.rentalTerms || "No special terms provided."}
              </p>
            </section>
          </div>

        
          <aside>
            <BookingCard
              id={String(gear._id)}
              price={Number(gear.rentalPrice) || 0}
              rentalType={gear.rentalType}
              stock={stock}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}