"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { deleteGear } from "@/lib/api/gear";
import { DeleteJobDialog } from "../DeleteDialog";

export default function DeleteEquipmentButton({ id, name }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteGear(id);
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not delete equipment",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DeleteJobDialog
      jobTitle={name}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
      triggerClassName="size-9"
    />
  );
}
