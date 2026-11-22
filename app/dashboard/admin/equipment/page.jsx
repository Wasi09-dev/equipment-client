import { Package } from "lucide-react";
import { redirect } from "next/navigation";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import GearCard from "@/components/GearCard";
import { getGear } from "@/lib/api/gear";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Equipment | RentGear" };

export default async function AdminEquipmentPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

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
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          Equipment <span className="text-orange-500">({gear.length})</span>
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every listing on the platform, including its owner.
        </p>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load equipment. Make sure the API server is running and refresh the page." />
      )}

      {!failed && gear.length === 0 && (
        <EmptyState
          icon={Package}
          title="No equipment listed"
          description="Owner listings will appear here once equipment is added."
        />
      )}

      {gear.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {gear.map((item) => (
            <GearCard key={item._id} gear={item} />
          ))}
        </div>
      )}
    </div>
  );
}
