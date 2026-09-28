import crypto from "crypto";
import { cookies } from "next/headers";
import { getUsers, saveUsers } from "./store";
import type { AdminUser } from "@/types";

const COOKIE_NAME = "cl_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

const DEFAULT_SECRET = "carters-logistics-change-this-secret";

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 32).toString("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

// ---------- User lookup ----------

export async function getUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const users = await getUsers();
  const target = normalizeUsername(username);
  return users.find((u) => normalizeUsername(u.username) === target) ?? null;
}

export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  const users = await getUsers();
  const target = normalizeEmail(email);
  return users.find((u) => normalizeEmail(u.email) === target) ?? null;
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

// ---------- Signup / login ----------

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; user?: AdminUser }> {
  const cleanUsername = username.trim();
  const cleanEmail = normalizeEmail(email);

  if (cleanUsername.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  if (await getUserByUsername(cleanUsername)) {
    return { ok: false, error: "That username is already taken." };
  }
  if (await getUserByEmail(cleanEmail)) {
    return { ok: false, error: "An account with that email already exists." };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const user: AdminUser = {
    id: crypto.randomUUID(),
    username: cleanUsername,
    email: cleanEmail,
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };

  const users = await getUsers();
  users.push(user);
  try {
    await saveUsers(users);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Could not save your account. Please try again.",
    };
  }

  return { ok: true, user };
}

export async function verifyUser(
  identifier: string,
  password: string
): Promise<AdminUser | null> {
  const value = identifier.trim();
  if (!value) return null;

  const user = value.includes("@")
    ? await getUserByEmail(value)
    : await getUserByUsername(value);
  if (!user) return null;

  const hash = hashPassword(password, user.salt);
  return safeEqual(hash, user.passwordHash) ? user : null;
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await getUserById(userId);
  if (!user) return { ok: false, error: "User not found." };

  const currentHash = hashPassword(currentPassword, user.salt);
  if (!safeEqual(currentHash, user.passwordHash)) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (newPassword.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters." };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { ok: false, error: "User not found." };
  users[index] = {
    ...users[index],
    salt,
    passwordHash: hashPassword(newPassword, salt),
  };
  await saveUsers(users);
  return { ok: true };
}

// ---------- Sessions ----------

function getSecret(): string {
  return process.env.ADMIN_SECRET || DEFAULT_SECRET;
}

function sign(payloadB64: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("hex");
}

export async function createSessionToken(userId: string): Promise<string> {
  const payload = JSON.stringify({
    uid: userId,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const payloadB64 = Buffer.from(payload, "utf-8").toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Returns the authenticated user id, or null when the token is missing,
 * invalid, or expired.
 */
export async function verifySessionToken(
  token: string
): Promise<string | null> {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) {
      return null;
    }
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionUserId()) !== null;
}

/** Returns the currently signed-in admin user, or null. */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return getUserById(userId);
}

export async function setSessionCookie(token: string): Promise<void> {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}


