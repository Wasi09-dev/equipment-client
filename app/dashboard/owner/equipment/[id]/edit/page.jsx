import { notFound, redirect } from "next/navigation";
import AddEquipmentForm from "@/components/dashboard/AddEquipmentForm";
import { getGearById } from "@/lib/api/gear";
import { getSessionUser } from "@/lib/session";

export const metadata = {
  title: "Edit Equipment | RentGear",
  description: "Update your equipment listing.",
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export default async function EditEquipmentPage({ params }) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user?.email) redirect("/sign-in");

  const gear = await getGearById(id).catch(() => null);
  if (!gear) notFound();

  if (normalize(gear.ownerEmail) !== normalize(user.email)) {
    redirect("/dashboard/owner/equipment");
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <AddEquipmentForm gear={gear} />
    </div>
  );
}
