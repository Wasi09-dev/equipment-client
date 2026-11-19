import AddEquipmentForm from "@/components/dashboard/AddEquipmentForm";

export const metadata = {
  title: "Add Equipment | RentGear",
  description: "List new machinery or gear for rent on RentGear.",
};

export default function AddEquipmentPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <AddEquipmentForm />
    </div>
  );
}
