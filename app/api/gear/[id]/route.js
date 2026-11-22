import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getGearById } from "@/lib/api/gear";
import { auth } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

async function authorize(id) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Please sign in." }, { status: 401 }),
    };
  }

  const gear = await getGearById(id).catch(() => null);
  if (!gear) {
    return {
      error: NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 },
      ),
    };
  }

  if (normalize(gear.ownerEmail) !== normalize(session.user.email)) {
    return {
      error: NextResponse.json(
        { error: "You can only manage your own equipment." },
        { status: 403 },
      ),
    };
  }

  return { gear, session };
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const authResult = await authorize(id);
  if (authResult.error) return authResult.error;

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${BASE_URL}/gears/${id}?ownerEmail=${encodeURIComponent(
        authResult.session.user.email,
      )}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Could not update equipment." },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update equipment error:", error);
    return NextResponse.json(
      { error: "Could not update equipment." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const authResult = await authorize(id);
  if (authResult.error) return authResult.error;

  try {
    const res = await fetch(
      `${BASE_URL}/gears/${id}?ownerEmail=${encodeURIComponent(
        authResult.session.user.email,
      )}`,
      { method: "DELETE", cache: "no-store" },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Could not delete equipment." },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete equipment error:", error);
    return NextResponse.json(
      { error: "Could not delete equipment." },
      { status: 500 },
    );
  }
}
