// app/api/combos/[id]/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Combo from "@/models/Combo";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const combo = await Combo.findById(id).populate("productIds");
    if (!combo) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(combo);
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const combo = await Combo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!combo) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(combo);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await connectToDatabase();
    const combo = await Combo.findByIdAndDelete(id);
    if (!combo) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}
