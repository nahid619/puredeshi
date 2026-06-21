// app/api/products/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Product from "@/models/Product";

// GET /api/products — public. Supports ?category=<id> filter for later use
// by the homepage's category sections.
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");

    const query = categoryId ? { category: categoryId } : {};
    const products = await Product.find(query)
      .populate("category")
      .sort({ sortOrder: 1 });

    return Response.json(products);
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}

// POST /api/products — admin only
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
    const product = await Product.create(body);
    return Response.json(product, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
