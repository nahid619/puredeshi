// app/api/auth/me/route.js
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ loggedIn: false });
  }
  return Response.json({ loggedIn: true, username: session.username });
}
