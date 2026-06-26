// lib/cloudinary.js
//
// Configures the Cloudinary SDK using environment variables.
// Phase 3 added real image uploads from the admin panel.
//
// extractPublicId() / deleteCloudinaryImage() were added afterward to stop
// replaced/deleted images from sitting around in Cloudinary forever — see
// app/api/upload/route.js and the products/banners DELETE routes for where
// these get called.

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Pulls the public_id (including folder) out of a Cloudinary secure_url, e.g.
//   https://res.cloudinary.com/<cloud>/image/upload/v1234567890/pure-deshi/abc123.jpg
//   -> "pure-deshi/abc123"
// Returns null for anything that isn't a Cloudinary URL — e.g. the local
// "/images/logo-emblem.png" default, an empty string, or undefined — so
// callers can pass any image value here without checking first.
export function extractPublicId(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("res.cloudinary.com")) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
}

// Best-effort delete: replacing or removing an image should never fail (or
// even slow down) the actual save the admin is doing just because Cloudinary
// cleanup hiccupped, so this swallows and logs errors instead of throwing.
export async function deleteCloudinaryImage(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Cloudinary cleanup failed for "${publicId}":`, err.message);
  }
}

export default cloudinary;