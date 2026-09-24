import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "resume_editor_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.RESUME_EDITOR_SESSION_SECRET;
  if (!secret) {
    throw new Error("RESUME_EDITOR_SESSION_SECRET is not configured");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ iat: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (isBypassEnabled()) return true;
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  let expectedSig: string;
  try {
    expectedSig = sign(payload);
  } catch {
    return false;
  }

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const { iat } = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (typeof iat !== "number") return false;
    return Date.now() - iat < SESSION_MAX_AGE_SECONDS * 1000;
  } catch {
    return false;
  }
}

export function isBypassEnabled(): boolean {
  return process.env.RESUME_EDITOR_BYPASS_LOGIN === "1" || process.env.RESUME_EDITOR_BYPASS_LOGIN === "true";
}

export function isLoginConfigured(): boolean {
  return Boolean(process.env.RESUME_EDITOR_USERNAME && process.env.RESUME_EDITOR_PASSWORD_HASH);
}

// A precomputed bcrypt hash with no matching plaintext, used so a wrong
// username still costs one bcrypt.compare call -- otherwise response time
// would leak whether the username was right before the password was ever checked.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8Q9m/1tHhZgRuLZ/kZVjXpqhP0/BJC";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.RESUME_EDITOR_USERNAME;
  const passwordHash = process.env.RESUME_EDITOR_PASSWORD_HASH;
  if (!expectedUsername || !passwordHash) {
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }

  const usernameMatches = username === expectedUsername;
  const passwordMatches = await bcrypt.compare(password, usernameMatches ? passwordHash : DUMMY_HASH);
  return usernameMatches && passwordMatches;
}

export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;
