const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to save booking (${res.status})`);
  }

  return res.json();
}

export async function getBookings({ email, ownerEmail, status } = {}) {
  const qs = new URLSearchParams();
  if (email) qs.set("email", email);
  if (ownerEmail) qs.set("ownerEmail", ownerEmail);
  if (status && status !== "all") qs.set("status", status);

  const res = await fetch(`${BASE_URL}/bookings?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load bookings (${res.status})`);
  }

  return res.json();
}

export async function getMyBookings(email) {
  return getBookings({ email });
}

export async function getOwnerStats(email) {
  const res = await fetch(
    `${BASE_URL}/owner/stats?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Failed to load owner stats (${res.status})`);
  }

  return res.json();
}

// Server-only: the admin key must never reach the browser.
export async function getAllBookingsAdmin() {
  const res = await fetch(`${BASE_URL}/admin/bookings`, {
    headers: { "x-admin-key": process.env.ADMIN_SETUP_KEY || "" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load platform bookings (${res.status})`);
  }

  return res.json();
}
