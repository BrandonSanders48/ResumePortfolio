// Web Crypto (not node:crypto) so this works from both the Edge-runtime
// middleware and the ordinary Node API route without diverging.
const encoder = new TextEncoder();

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const SITE_GATE_COOKIE = "site_verified";
export const SITE_GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * The full-site gate is a separate opt-in from the contact-form/resume
 * Turnstile checks, even though it reuses the same keys: turning on
 * TURNSTILE_SITE_KEY/SECRET_KEY for those two features shouldn't silently
 * start gating the entire site too.
 */
export function isSiteGateEnabled(): boolean {
  const flag = process.env.SITE_GATE_ENABLED;
  const enabled = flag === "1" || flag === "true";
  return enabled && Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function createGateToken(): Promise<string> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not configured");
  const payload = btoa(JSON.stringify({ iat: Date.now() }));
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyGateToken(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = await hmac(secret, payload);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return false;

  try {
    const { iat } = JSON.parse(atob(payload));
    if (typeof iat !== "number") return false;
    return Date.now() - iat < SITE_GATE_MAX_AGE * 1000;
  } catch {
    return false;
  }
}
