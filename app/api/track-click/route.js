// app/api/track-click/route.js
//
// Records a single ClickLog entry every time a visitor taps an "Order Now"
// button for a real product (Section 6 of spec). Powers the admin
// Dashboard's "this month's order clicks" and "most popular product" cards.
// Public — no login needed, this is customer-facing.
//
// Fire-and-forget by design: if this fails, the WhatsApp link still opens
// for the customer regardless (this never blocks the actual order).

import { connectToDatabase } from "@/lib/mongodb";
import ClickLog from "@/models/ClickLog";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { productId } = body || {};
  if (!productId) {
    return Response.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await ClickLog.create({ productId });
    return Response.json({ ok: true });
  } catch (err) {
    // Logged but not surfaced loudly — see file header.
    return Response.json({ error: err.message }, { status: 500 });
  }
}
