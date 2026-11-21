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

export async function getMyBookings(email) {
  const res = await fetch(
    `${BASE_URL}/bookings?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Failed to load bookings (${res.status})`);
  }

  return res.json();
}
