// app/api/upload/route.js
//
// Accepts a single image file from the admin panel's upload box and
// forwards it to Cloudinary using the server-side SDK (lib/cloudinary.js),
// which is already configured with the Cloud name / API key / API secret
// from .env.local. Returns the resulting Cloudinary URL, which the admin
// panel then stores on the product/banner document.
//
// Admin-only — same session check as every other write operation.

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs"; // Buffer/cloudinary SDK need the Node runtime, not Edge

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type?.startsWith("image/")) {
    return Response.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  const MAX_BYTES = 8 * 1024 * 1024; // 8MB
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Image is too large (max 8MB)" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "pure-deshi",
    });

    return Response.json({ url: result.secure_url });
  } catch (err) {
    return Response.json(
      { error: `Cloudinary upload failed: ${err.message}` },
      { status: 500 }
    );
  }
}
