import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { getSessionUser } from "@/lib/session";

function formatMemberSince(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <ProfileForm
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role ?? "customer",
        memberSince: formatMemberSince(user.createdAt),
      }}
    />
  );
}
