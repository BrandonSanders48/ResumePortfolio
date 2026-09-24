// User-Agent match for well-known search-engine crawlers, so they can index
// the site even while the Turnstile gate is on. This is NOT a security
// control -- User-Agent is trivially spoofable, so anyone can claim to be
// Googlebot and skip the gate this way. That's an acceptable trade for a
// portfolio site with no sensitive content behind the gate; the gate exists
// to slow down casual/anonymous traffic, not to keep out a motivated visitor.
const CRAWLER_USER_AGENTS = [
  "Googlebot",
  "Google-InspectionTool",
  "bingbot",
  "Slurp", // Yahoo
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Applebot",
];

const CRAWLER_UA_PATTERN = new RegExp(CRAWLER_USER_AGENTS.join("|"), "i");

export function isKnownSearchEngineCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return CRAWLER_UA_PATTERN.test(userAgent);
}
