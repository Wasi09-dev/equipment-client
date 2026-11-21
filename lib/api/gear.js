const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getGear = async (query = "") => {
  const res = await fetch(`${BASE_URL}/gears${query}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load gear (${res.status})`);
  }

  return res.json();
};

export const deleteGear = async (id) => {
  const res = await fetch(`${BASE_URL}/gears/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete gear (${res.status})`);
  }

  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/gears/categories`, { cache: "no-store" });
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