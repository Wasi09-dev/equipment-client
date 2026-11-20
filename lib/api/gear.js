const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getGear = async () => {
  const res = await fetch(`${BASE_URL}/gears`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load gear (${res.status})`);
  }

  return res.json();
};
