// app/api/products/[id]/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Product from "@/models/Product";
import { friendlyDbError } from "@/lib/errors";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(product);
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
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (err) {
    return Response.json({ error: friendlyDbError(err) }, { status: 400 });
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
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
