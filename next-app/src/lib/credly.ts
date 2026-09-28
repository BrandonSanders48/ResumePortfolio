const CREDLY_USER = "brandonsanders";

/**
 * Total public badge count from Credly's profile JSON (the same feed their
 * own profile page uses; not a documented API, so treat it as best-effort).
 * Fetched server-side and cached for a day, so visitors never hit Credly
 * and a Credly outage just means the count is left off the page.
 */
export async function getCredlyBadgeCount(): Promise<number | null> {
  try {
    const res = await fetch(`https://www.credly.com/users/${CREDLY_USER}/badges.json`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const count = json?.metadata?.total_count;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}
