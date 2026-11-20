import { getGear } from "@/lib/api/gear";

export const metadata = {
  title: "All Equipment | RentGear",
  description: "Browse all equipment available for rent.",
};

export default async function AllEquipmentPage({searchParams}) : Promise<JSX.Element> {
  let gear = [];
const search = await searchParams;
const url = new URLSearchParams(search);
const query = url.toString();
  try {
    const data = await getGear(query);
    gear = Array.isArray(data) ? data : [];
  } catch {
    gear = [];
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">All Equipment ({gear.length})</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gear.map((item) => (
          <div key={item._id} className="rounded-xl border p-4">
            <h2 className="font-semibold">{item.equipmentName}</h2>
            <p className="text-sm text-stone-500">{item.category}</p>
            <p className="mt-2 font-bold">${item.rentalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}