// Public profile data outside this site (GitHub, Credly, LinkedIn snapshot)
// for grounding "Ask AI" answers. Each source is fetched server-side, cached
// in memory for a day, and fails soft: if one is down, the AI just answers
// without it.

import { LINKEDIN_PROFILE, LINKEDIN_URL } from "@/lib/linkedin-profile";

const GITHUB_USER = "BrandonSanders48";
const CREDLY_USER = "brandonsanders";
const CACHE_MS = 24 * 60 * 60 * 1000;
const README_CHARS = 700;

export type ExternalProfile = { key: "github" | "credly" | "linkedin"; label: string; url: string; text: string };

let cache: { at: number; profiles: ExternalProfile[] } | null = null;

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers: { "User-Agent": "BrandonSanders.org", ...headers }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

/** Strips a README down to readable prose: no images, badges, HTML, or code blocks. */
function readmeExcerpt(md: string): string {
  const text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > README_CHARS ? `${text.slice(0, README_CHARS)}…` : text;
}

type GhUser = { bio: string | null; public_repos: number };
type GhRepo = { name: string; fork: boolean; archived: boolean; description: string | null; language: string | null; stargazers_count: number; html_url: string; pushed_at: string };

async function github(): Promise<ExternalProfile | null> {
  try {
    const [user, repos] = await Promise.all([
      getJson<GhUser>(`https://api.github.com/users/${GITHUB_USER}`),
      getJson<GhRepo[]>(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`),
    ]);
    // Forks are other people's projects; including them would let the model
    // claim Brandon built them.
    const own = repos.filter((r) => !r.fork);
    const lines = await Promise.all(
      own.map(async (r) => {
        let readme = "";
        try {
          // raw.githubusercontent.com isn't subject to the 60/hour API limit.
          const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${r.name}/HEAD/README.md`, {
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) readme = readmeExcerpt(await res.text());
        } catch {
          // No README (or unreachable): the description alone is fine.
        }
        const meta = [r.language, r.stargazers_count ? `${r.stargazers_count}★` : "", `last updated ${r.pushed_at.slice(0, 10)}`].filter(Boolean).join(", ");
        return `- ${r.name} (${meta}): ${r.description ?? "no description"}${readme ? `\n  README: ${readme}` : ""}`;
      })
    );
    const text = [`Bio: ${user.bio ?? ""}`, `Original public repositories (${own.length}; forks excluded):`, ...lines].join("\n");
    return { key: "github", label: "GitHub", url: `https://github.com/${GITHUB_USER}`, text };
  } catch (err) {
    console.error("Ask: GitHub profile fetch failed:", err);
    return null;
  }
}

type CredlyBadge = {
  issued_at_date: string | null;
  expires_at_date: string | null;
  badge_template: { name: string };
  issuer?: { entities?: { entity?: { name?: string } }[] };
};

async function credly(): Promise<ExternalProfile | null> {
  try {
    const { data } = await getJson<{ data: CredlyBadge[] }>(`https://www.credly.com/users/${CREDLY_USER}/badges.json`, {
      Accept: "application/json",
    });
    const today = new Date().toISOString().slice(0, 10);
    const lines = data.map((b) => {
      const issuer = b.issuer?.entities?.map((e) => e.entity?.name).filter(Boolean).join(", ");
      const expiry = b.expires_at_date
        ? b.expires_at_date < today
          ? `EXPIRED ${b.expires_at_date}`
          : `valid until ${b.expires_at_date}`
        : "no expiration";
      return `- ${b.badge_template.name}${issuer ? ` (${issuer})` : ""}: issued ${b.issued_at_date ?? "unknown"}, ${expiry}`;
    });
    return {
      key: "credly",
      label: "Credly",
      url: `https://www.credly.com/users/${CREDLY_USER}`,
      text: [`${data.length} verified badges:`, ...lines].join("\n"),
    };
  } catch (err) {
    console.error("Ask: Credly fetch failed:", err);
    return null;
  }
}

function linkedin(): ExternalProfile | null {
  const text = LINKEDIN_PROFILE.trim();
  return text ? { key: "linkedin", label: "LinkedIn", url: LINKEDIN_URL, text: text.slice(0, 6000) } : null;
}

export async function getExternalProfiles(): Promise<ExternalProfile[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.profiles;
  const fetched = await Promise.all([github(), credly()]);
  const profiles = [...fetched, linkedin()].filter((p): p is ExternalProfile => p !== null);
  // If a source was briefly down, retry in an hour instead of pinning the gap for a day.
  const anyFailed = fetched.some((p) => p === null);
  cache = { at: Date.now() - (anyFailed ? CACHE_MS - 60 * 60 * 1000 : 0), profiles };
  return profiles;
}
