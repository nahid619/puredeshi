// app/api/combos/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Combo from "@/models/Combo";

export async function GET() {
  try {
    await connectToDatabase();
    const combos = await Combo.find().populate("productIds");
    return Response.json(combos);
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const combo = await Combo.create(body);
    return Response.json(combo, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
