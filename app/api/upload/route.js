// app/api/upload/route.js
//
// Accepts a single image file from the admin panel's upload box and
// forwards it to Cloudinary using the server-side SDK (lib/cloudinary.js),
// which is already configured with the Cloud name / API key / API secret
// from .env.local. Returns the resulting Cloudinary URL, which the admin
// panel then stores on the product/banner/settings document.
//
// If the caller also sends an "oldUrl" field (the image being replaced),
// it gets deleted from Cloudinary right after the new one uploads
// successfully — otherwise every replaced image just sits there forever,
// quietly using up storage. This is best-effort: if cleanup fails for any
// reason, the new upload still succeeds and is still returned normally.
//
// Admin-only — same session check as every other write operation.

import { getSession } from "@/lib/auth";
import cloudinary, { deleteCloudinaryImage } from "@/lib/cloudinary";

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

  // Optional — the image URL (if any) that this upload is replacing.
  const oldUrl = formData.get("oldUrl");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "pure-deshi",
    });

    // Clean up the old image now that the new one is safely uploaded. This
    // runs after the new upload succeeds (not before) so a replace never
    // risks deleting the old image and then failing to get a new one.
    if (oldUrl && typeof oldUrl === "string") {
      await deleteCloudinaryImage(oldUrl);
    }

    return Response.json({ url: result.secure_url });
  } catch (err) {
    return Response.json(
      { error: `Cloudinary upload failed: ${err.message}` },
      { status: 500 }
    );
  }
}