"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      console.error(error);
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