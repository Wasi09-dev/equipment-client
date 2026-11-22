"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/api/users";

export default function UserRoleSelect({ userId, role, adminEmail, disabled }) {
  const router = useRouter();
  const [value, setValue] = useState(role);
  const [saving, setSaving] = useState(false);

  const handleChange = async (event) => {
    const next = event.target.value;
    const previous = value;
    setValue(next);
    setSaving(true);
    try {
      await updateUserRole(userId, next, adminEmail);
      router.refresh();
    } catch (error) {
      setValue(previous); 
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled || saving}
      className="h-9 rounded-lg border border-orange-200 bg-white px-2 text-sm font-medium capitalize text-stone-700 focus:border-orange-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="customer">Customer</option>
      <option value="owner">Owner</option>
      <option value="admin">Admin</option>
    </select>
  );
}