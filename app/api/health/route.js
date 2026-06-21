// app/api/health/route.js
//
// A simple status check used by the homepage's "Setup Status" panel.
// It tries to actually talk to MongoDB Atlas and Cloudinary using whatever
// credentials are in .env.local, and reports back whether each one works.
// This is the easiest way for a non-developer to confirm Phase 1 succeeded
// without using the command line.

import { connectToDatabase } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const result = {
    mongodb: { configured: false, connected: false, message: "" },
    cloudinary: { configured: false, connected: false, message: "" },
  };

  // --- MongoDB check ---
  if (!process.env.MONGODB_URI) {
    result.mongodb.message =
      "Not configured yet — add MONGODB_URI to .env.local";
  } else {
    result.mongodb.configured = true;
    try {
      await connectToDatabase();
      result.mongodb.connected = true;
      result.mongodb.message = "Connected successfully";
    } catch (err) {
      result.mongodb.message = `Connection failed: ${err.message}`;
    }
  }

  // --- Cloudinary check ---
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    result.cloudinary.message =
      "Not configured yet — add Cloudinary keys to .env.local";
  } else {
    result.cloudinary.configured = true;
    try {
      const ping = await cloudinary.api.ping();
      result.cloudinary.connected = ping.status === "ok";
      result.cloudinary.message = "Connected successfully";
    } catch (err) {
      result.cloudinary.message = `Connection failed: ${
        err.message || "unknown error"
      }`;
    }
  }

  return Response.json(result);
}
