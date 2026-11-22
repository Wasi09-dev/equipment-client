import { Package, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import AutoSubmitForm from "@/components/AutoSubmitForm";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import GearCard from "@/components/GearCard";
import Pagination from "@/components/Pagination";
import { getCategories, getGear } from "@/lib/api/gear";

export const metadata = {
  title: "All Equipment | RentGear",
  description: "Browse all equipment available for rent.",
};

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];
const PAGE_SIZE = 9;

const toArray = (value) =>
  value ? (Array.isArray(value) ? value : [value]) : [];

export default async function AllEquipmentPage({ searchParams }) {
  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const currentPage = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key === "page") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) qs.append(key, item);
      });
    } else if (value) {
      qs.append(key, value);
    }
  });
  qs.set("page", String(currentPage));
  qs.set("limit", String(PAGE_SIZE));

  let items = [];
  let total = 0;
  let totalPages = 1;
  let failed = false;

  try {
    const data = await getGear(`?${qs.toString()}`);
    items = Array.isArray(data) ? data : (data.items ?? []);
    total = Array.isArray(data) ? data.length : (data.total ?? 0);
    totalPages = Array.isArray(data) ? 1 : (data.totalPages ?? 1);
  } catch {
    failed = true;
  }

  let categories = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const selectedCategories = toArray(params.category);
  const selectedTypes = toArray(params.rentalType).map((type) =>
    type.toLowerCase(),
  );

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total);

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
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm accent-orange-500"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={category}
                    defaultChecked={selectedCategories.includes(category)}
                  />
                  {category}
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
              {RENTAL_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm accent-orange-500"
                >
                  <input
                    type="checkbox"
                    name="rentalType"
                    value={type}
                    defaultChecked={selectedTypes.includes(type.toLowerCase())}
                  />
                  {type}
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
            {selectedCategories.map((category) => (
              <input
                key={category}
                type="hidden"
                name="category"
                value={category}
              />
            ))}
            {selectedTypes.map((type) => (
              <input key={type} type="hidden" name="rentalType" value={type} />
            ))}
            {params.location && (
              <input type="hidden" name="location" value={params.location} />
            )}
            {params.minPrice && (
              <input type="hidden" name="minPrice" value={params.minPrice} />
            )}
            {params.maxPrice && (
              <input type="hidden" name="maxPrice" value={params.maxPrice} />
            )}
            {params.available && (
              <input type="hidden" name="available" value={params.available} />
            )}

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

          <h1 className="mb-2 text-2xl font-bold text-[#3b2314]">
            All Equipment <span className="text-orange-600">({total})</span>
          </h1>

          {!failed && total > 0 && (
            <p className="mb-5 text-sm text-stone-500">
              Showing {rangeStart}-{rangeEnd} of {total} results
            </p>
          )}

          {failed && <ErrorCard />}

          {!failed && items.length === 0 && (
            <EmptyState
              icon={Package}
              title="No equipment found"
              description="No listings match your filters. Try adjusting or clearing them to see all available equipment."
              actionLabel="Clear all filters"
              actionHref="/equipment"
            />
          )}

          {!failed && items.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <GearCard key={item._id} gear={item} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                params={params}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
