// app/api/auth/login/route.js
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { createSession } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return Response.json(
      { error: "Username and password are both required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(admin.username);

    return Response.json({ ok: true, username: admin.username });
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}
