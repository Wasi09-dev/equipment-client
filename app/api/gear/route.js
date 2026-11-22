import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    if (!["owner", "admin"].includes(session.user.role ?? "customer")) {
      return NextResponse.json(
        { error: "Only owners can add equipment." },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    // Ownership always comes from the session, never from the browser.
    const res = await fetch(`${BASE_URL}/gears`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        ownerEmail: session.user.email,
        ownerName: session.user.name || null,
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Could not create equipment." },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create equipment error:", error);
    return NextResponse.json(
      { error: "Could not create equipment." },
      { status: 500 },
    );
  }
}
