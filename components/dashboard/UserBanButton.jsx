"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserBanned } from "@/lib/api/users";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "../ui/toast";

export default function UserBanButton({ userId, name, banned, adminEmail, disabled }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const run = async (nextBanned) => {
    setLoading(true);
    try {
      await setUserBanned(userId, nextBanned, adminEmail);
      setOpen(false);
      router.refresh();
    } catch (error) {
     toast.add({
  type: "error",
  title: "Couldn't update user",
  description: error.message,
});
    } finally {
      setLoading(false);
    }
  };

  
  if (banned) {
    return (
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => run(false)}
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
      >
        {loading ? "..." : "Unban"}
      </button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        disabled={disabled || loading}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ban
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban this user?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{name}&quot; will be suspended. You can unban them anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={loading} onClick={() => run(true)}>
            {loading ? "Banning..." : "Ban"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}