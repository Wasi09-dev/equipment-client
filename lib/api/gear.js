const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getGear = async (query = "") => {
  const res = await fetch(`${BASE_URL}/gears${query}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load gear (${res.status})`);
  }

  return res.json();
};

export const deleteGear = async (id) => {
  // Goes through the Next.js route handler so ownership is checked with the session.
  const res = await fetch(`/api/gear/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete gear (${res.status})`);
  }

  return res.json();
};

export const updateGear = async (id, data) => {
  const res = await fetch(`/api/gear/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to update gear (${res.status})`);
  }

  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/gears/categories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
};

export const getPopularGear = async () => {
  const res = await fetch(`${BASE_URL}/gears/popular`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load popular gear (${res.status})`);
  return res.json();
};

export const getGearById = async (id) => {
  const res = await fetch(`${BASE_URL}/gears/${id}`, { cache: "no-store" });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to load gear (${res.status})`);

  return res.json();
};
