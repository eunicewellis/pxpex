import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, verifyUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const identifier = String(body.identifier ?? "").trim();
  const password = String(body.password ?? "");

  const user = await verifyUser(identifier, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid username/email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(user.id);
  await setSessionCookie(token);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, email: user.email },
  });
}
