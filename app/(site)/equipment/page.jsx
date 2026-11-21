import Link from "next/link";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { getCategories, getGear } from "@/lib/api/gear";
import AutoSubmitForm from "@/components/AutoSubmitForm";
import GearCard from "@/components/GearCard";;
export const metadata = {
  title: "All Equipment | RentGear",
  description: "Browse all equipment available for rent.",
};



const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

const toArray = (v) => (v ? (Array.isArray(v) ? v : [v]) : []);





export default async function AllEquipmentPage({ searchParams }) {
  const params = await searchParams;

 
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    else if (value) qs.append(key, value);
  });
  const query = qs.toString() ? `?${qs.toString()}` : "";

  let gear = [];
  try {
    const data = await getGear(query);
    gear = Array.isArray(data) ? data : [];
  } catch {
    gear = [];
  }
const CATEGORIES = await getCategories();
  const selectedCategories = toArray(params.category);
  const selectedTypes = toArray(params.rentalType).map((t) => t.toLowerCase());

  return (
    <div className="bg-[#faf6f1]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
        {/* Filter sidebar */}
      <AutoSubmitForm className="h-fit space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-[#3b2314]">
            <SlidersHorizontal className="h-4 w-4 text-orange-600" />
            Filters
          </h2>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3b2314]">
              Category
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm accent-orange-500">
                  <input
                    type="checkbox"
                    name="category"
                    value={c}
                    defaultChecked={selectedCategories.includes(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3b2314]">
              Location
            </h3>
            <input
              type="text"
              name="location"
              defaultValue={params.location || ""}
              placeholder="e.g. Dhaka, Sylhet..."
              className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
            />
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3b2314]">
              Rental Type
            </h3>
            <div className="space-y-2">
              {RENTAL_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm accent-orange-500">
                  <input
                    type="checkbox"
                    name="rentalType"
                    value={t}
                    defaultChecked={selectedTypes.includes(t.toLowerCase())}
                  />
                  {t}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3b2314]">
              Price Range
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                min="0"
                defaultValue={params.minPrice || ""}
                placeholder="৳ Min"
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                min="0"
                defaultValue={params.maxPrice || ""}
                placeholder="৳ Max"
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3b2314]">
              Availability
            </h3>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                name="available"
                value="true"
                defaultChecked={params.available === "true"}
              />
              Available Only
            </label>
          </section>

 <div className="space-y-2">
  {params.search && (
    <input type="hidden" name="search" value={params.search} />
  )}
  <Link
    href="/equipment"
    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
  >
    <RotateCcw className="h-4 w-4" />
    Clear All Filters
  </Link>
</div>
      </AutoSubmitForm>

        {/* Equipment grid */}
        <section>
          <form method="GET" className="mb-6">

  {selectedCategories.map((c) => (
    <input key={c} type="hidden" name="category" value={c} />
  ))}
  {selectedTypes.map((t) => (
    <input key={t} type="hidden" name="rentalType" value={t} />
  ))}
  {params.location && <input type="hidden" name="location" value={params.location} />}
  {params.minPrice && <input type="hidden" name="minPrice" value={params.minPrice} />}
  {params.maxPrice && <input type="hidden" name="maxPrice" value={params.maxPrice} />}
  {params.available && <input type="hidden" name="available" value={params.available} />}

  <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white p-2 shadow-sm shadow-orange-500/5">
    <Search className="ml-3 h-5 w-5 shrink-0 text-stone-400" />
    <input
      type="text"
      name="search"
      defaultValue={params.search || ""}
      placeholder="Search by equipment name, category or brand..."
      className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
    />
    <button
      type="submit"
      className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700"
    >
      Search
    </button>
  </div>
</form>
          <h1 className="mb-5 text-2xl font-bold text-[#3b2314]">
            All Equipment{" "}
            <span className="text-orange-600">({gear.length})</span>
          </h1>

          {gear.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
            no equipment found matching your filters. Try adjusting the filters or clearing them to see all available equipment.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {gear.map((item) => (
                <GearCard key={item._id} gear={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}