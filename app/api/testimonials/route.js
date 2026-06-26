// app/api/testimonials/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ sortOrder: 1 });
    return Response.json(testimonials);
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
    const testimonial = await Testimonial.create(body);
    return Response.json(testimonial, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}