// app/api/settings/route.js
//
// Settings is a singleton — there should only ever be one document in this
// collection. GET creates it with defaults the first time it's requested
// if it doesn't exist yet; PUT always updates that same document.

import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Settings from "@/models/Settings";

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await getOrCreateSettings();
    return Response.json(settings);
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
    const existing = await getOrCreateSettings();
    const updated = await Settings.findByIdAndUpdate(existing._id, body, {
      new: true,
      runValidators: true,
    });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
