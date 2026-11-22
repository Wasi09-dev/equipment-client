export const createGear = async (data) => {
  // The route handler adds ownerEmail/ownerName from the Better Auth session.
  const res = await fetch("/api/gear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      result.error || `Failed to create equipment (${res.status})`,
    );
  }

  return result;
};
