import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, createUser, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  const result = await createUser(username, email, password);
  if (!result.ok || !result.user) {
    return NextResponse.json(
      { error: result.error || "Could not create account." },
      { status: 400 }
    );
  }

  // Sign the new user in immediately.
  const token = await createSessionToken(result.user.id);
  await setSessionCookie(token);

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
      },
    },
    { status: 201 }
  );
}