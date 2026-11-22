import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorCard from "@/components/dashboard/ErrorCard";
import { getUsers } from "@/lib/api/users";
import { formatDate } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Users | RentGear" };

const roleStyles = {
  owner: "border-orange-200 bg-orange-50 text-orange-700",
  customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  admin: "border-purple-200 bg-purple-50 text-purple-700",
};

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  let users = [];
  let failed = false;

  try {
    const data = await getUsers();
    users = Array.isArray(data) ? data : [];
  } catch {
    failed = true;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/50 p-5 shadow-sm shadow-orange-500/5 sm:p-6">
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
          Users <span className="text-orange-500">({users.length})</span>
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every account registered on the platform.
        </p>
      </section>

      {failed && (
        <ErrorCard message="Couldn't load users. Make sure the API server is running and refresh the page." />
      )}

      {!failed && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Registered accounts will appear here."
        />
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-900/5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-orange-100 bg-orange-50/60 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {users.map((item) => {
                const role = item.role || "customer";
                return (
                  <tr
                    key={item._id || item.id || item.email}
                    className="hover:bg-orange-50/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-500 text-xs font-bold text-white">
                          {(item.name || item.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <span className="font-semibold text-[#3b2314]">
                          {item.name || "Unnamed user"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{item.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          roleStyles[role] ?? roleStyles.customer
                        }`}
                      >
                        {role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
