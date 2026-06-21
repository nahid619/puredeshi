// lib/auth.js
//
// Lightweight session-based admin auth — no NextAuth, just a signed JWT
// stored in an HTTP-only cookie. Good enough for "one or two admin users,
// no roles," which is all this project needs (see Section 2 of the spec).

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "pd_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random string to .env.local — see .env.example."
    );
  }
  return new TextEncoder().encode(secret);
}

// Create a signed session token for a given admin username and set it as
// an HTTP-only cookie on the response.
export async function createSession(username) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

// Clear the session cookie (logout).
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Read + verify the session cookie. Returns the payload (e.g. { username })
// if valid, or null if missing/invalid/expired. Never throws.
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

// Convenience guard for API routes: returns the session, or null.
// Usage in a route handler:
//   const session = await requireSession();
//   if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
export async function requireSession() {
  return getSession();
}
