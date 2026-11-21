import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPopularGear } from "@/lib/api/gear";
import GearCard from "@/components/GearCard";

export default async function PopularEquipment() {
  let gear = [];
  try {
    const data = await getPopularGear();
    gear = Array.isArray(data) ? data : [];
  } catch {
    gear = [];
  }

  if (gear.length === 0) return null; // data না থাকলে section-ই দেখাবে না

  return (
    <section className="bg-[#faf6f1] py-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#3b2314] sm:text-3xl">
              Popular <span className="text-orange-600">Equipment</span>
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Top picks renters love, ready for you to book.
            </p>
          </div>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {gear.map((item) => (
            <GearCard key={item._id} gear={item} />
          ))}
        </div>
      </div>
    </section>
  );
}