"use client";

import {
  CalendarDays,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const roleStyles = {
  owner: "border-orange-200 bg-orange-50 text-orange-700",
  customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  admin: "border-purple-200 bg-purple-50 text-purple-700",
};

const inputClass =
  "h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-stone-50 disabled:text-stone-400";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const role = user.role || "customer";
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      toast.add({
        type: "error",
        title: "Name is required",
        description: "Please enter your full name.",
      });
      return;
    }

    if (nextName.length > 60) {
      toast.add({
        type: "error",
        title: "Name is too long",
        description: "Please keep your name under 60 characters.",
      });
      return;
    }

    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: nextName });
      if (result?.error) {
        throw new Error(
          result.error.message || "Could not update your profile.",
        );
      }

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your name has been saved.",
      });
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Update failed",
        description: error.message || "Could not update your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage the account details shown on your dashboard.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm shadow-orange-900/5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
            {user.image && !imageFailed ? (
              <img
                src={user.image}
                alt={user.name || user.email}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          <h2 className="mt-4 truncate text-lg font-bold text-[#3b2314]">
            {user.name || "Unnamed user"}
          </h2>
          <p className="mt-1 flex items-center justify-center gap-1 truncate text-xs text-stone-500">
            <Mail className="h-3.5 w-3.5 text-orange-400" />
            {user.email}
          </p>

          <span
            className={`mt-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
              roleStyles[role] ?? roleStyles.customer
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {role}
          </span>

          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-stone-500">
            <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
            Member since {user.memberSince || "—"}
          </p>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-orange-500">
              <UserRound className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-[#3b2314]">Account details</h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1.5 block text-sm font-semibold text-[#3b2314]"
              >
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-1.5 block text-sm font-semibold text-[#3b2314]"
              >
                Email address
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                disabled
                className={inputClass}
              />
              {/* Email changes are disabled on purpose: changing the account email
                  would orphan existing bookings, equipment ownership and payouts. */}
              <p className="mt-1.5 text-xs text-stone-500">
                Email changes are disabled because they would disconnect your
                existing bookings and equipment. Contact support if you need to
                change it.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving || name.trim() === (user.name || "")}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
