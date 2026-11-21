import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getGearById } from "@/lib/api/gear";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const DAY_MS = 1000 * 60 * 60 * 24;

const truncate = (value, max = 500) => String(value ?? "").slice(0, max);

// Stripe only accepts absolute https image URLs.
function firstHttpsImage(imageUrls) {
  const urls = String(imageUrls || "")
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);

  return (
    urls.find((url) => {
      try {
        return new URL(url).protocol === "https:";
      } catch {
        return false;
      }
    }) || null
  );
}

function rentalUnits(days, rentalType) {
  const type = String(rentalType || "daily").toLowerCase();
  if (type === "weekly") return Math.ceil(days / 7);
  if (type === "monthly") return Math.ceil(days / 30);
  return days;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const { equipmentId, startDate, endDate, quantity, phone, address, notes } =
      body;

    if (!equipmentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Equipment and rental dates are required." },
        { status: 400 },
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 },
      );
    }

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return NextResponse.json(
        { error: "The end date must be on or after the start date." },
        { status: 400 },
      );
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1." },
        { status: 400 },
      );
    }

    if (!String(phone || "").trim() || !String(address || "").trim()) {
      return NextResponse.json(
        { error: "Phone number and delivery address are required." },
        { status: 400 },
      );
    }

    // Verify the user server-side: never trust identity or totals from the browser.
    const authSession = await auth.api.getSession({ headers: await headers() });
    if (!authSession?.user) {
      return NextResponse.json(
        { error: "Please sign in to book equipment." },
        { status: 401 },
      );
    }

    if ((authSession.user.role ?? "customer") !== "customer") {
      return NextResponse.json(
        { error: "Only customers can book equipment." },
        { status: 403 },
      );
    }

    let gear = null;
    try {
      gear = await getGearById(equipmentId);
    } catch (error) {
      console.error("Could not load equipment for checkout:", error);
      return NextResponse.json(
        { error: "Could not load equipment. Please try again." },
        { status: 502 },
      );
    }

    if (!gear) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 },
      );
    }

    const stock = Number(gear.quantity) || 0;
    if (qty > stock) {
      return NextResponse.json(
        { error: `Only ${stock} unit(s) available.` },
        { status: 400 },
      );
    }

    const price = Number(gear.rentalPrice);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "This equipment has no valid rental price." },
        { status: 400 },
      );
    }

    // Recompute the total on the server so the browser cannot change the price.
    const days = Math.max(1, Math.ceil((end - start) / DAY_MS));
    const units = rentalUnits(days, gear.rentalType);
    const total = Math.round(units * price * qty * 100) / 100;
    const unitAmount = Math.round(total * 100);

    if (unitAmount < 1) {
      return NextResponse.json(
        { error: "Invalid rental total." },
        { status: 400 },
      );
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    const image = firstHttpsImage(gear.imageUrls);
    const equipmentName = gear.equipmentName || "Equipment Rental";

    // NOTE: The UI shows ৳ (BDT), but Stripe test mode does not support BDT.
    // We charge the same numeric amount in USD (smallest unit = cents).
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: equipmentName,
              ...(image ? { images: [image] } : {}),
            },
          },
        },
      ],
      customer_email: authSession.user.email,
      metadata: {
        equipmentId: String(equipmentId),
        customerEmail: truncate(authSession.user.email),
        customerName: truncate(authSession.user.name || "", 100),
        startDate,
        endDate,
        quantity: String(qty),
        phone: truncate(phone),
        address: truncate(address),
        notes: truncate(notes, 480),
      },
      success_url: `${origin}/dashboard/customer/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/equipment/${equipmentId}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Could not start checkout." },
      { status: error.statusCode || 500 },
    );
  }
}
