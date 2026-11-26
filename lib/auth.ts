import crypto from "node:crypto";
import { cookies } from "next/headers";
import { ensureSchema, getSql } from "./db";

export const ADMIN_COOKIE_NAME = "ls_admin_session";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "LeaderAdmin2026!";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.DATABASE_URL ||
    "leader-strategies-fallback-secret"
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, keyHex] = stored.split(":");
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, "hex");
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    return true;
  }
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT value FROM site_settings WHERE key = 'admin_password_hash' LIMIT 1
    `) as { value: string }[];
    if (rows.length > 0 && typeof rows[0].value === "string") {
      return verifyPasswordHash(password, rows[0].value);
    }
  } catch {
    // Fall back to default if DB is unreachable
  }
  return password === DEFAULT_ADMIN_PASSWORD;
}

export function signSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: string;
      exp?: number;
    };
    if (parsed.role !== "admin") return false;
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
