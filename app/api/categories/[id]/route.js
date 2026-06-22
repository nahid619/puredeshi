// app/api/categories/[id]/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Category from "@/models/Category";
import { friendlyDbError } from "@/lib/errors";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const category = await Category.findById(id);
    if (!category) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(category);
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
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(category);
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
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
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
