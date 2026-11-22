const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Server-only: the admin key must never reach the browser.
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { "x-admin-key": process.env.ADMIN_SETUP_KEY || "" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load users (${res.status})`);
  }

  return res.json();
}
