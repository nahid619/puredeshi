// app/api/categories/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Category from "@/models/Category";

// GET /api/categories — public, used by the homepage to render category nav
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ sortOrder: 1 });
    return Response.json(categories);
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}

// POST /api/categories — admin only
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
    const category = await Category.create(body);
    return Response.json(category, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
