// Server-side text corpus of the public pages, for grounding "Ask AI"
// answers. Built by fetching the site's own rendered pages (so it always
// matches what visitors see) and cached in memory for an hour.

import { vendorGroups } from "@/lib/content";

/**
 * The vendor strip as one compact, grouped block. Always included in the
 * context: a question like "what firewalls has he used?" never shares words
 * with the chip names ("Fortinet", "SonicWall"), so keyword retrieval alone
 * would miss them, while the model knows which vendors are which.
 */
const VENDOR_SUMMARY =
  "[Home › Skills › Platforms I've deployed & managed]\n" +
  vendorGroups.map((g) => `- ${g.title}: ${g.vendors.map((v) => v.name).join(", ")}`).join("\n");

export type CorpusLine = {
  path: string;
  pageLabel: string;
  sectionId: string | null;
  sectionTitle: string;
  text: string;
};

export type Source = Pick<CorpusLine, "path" | "pageLabel" | "sectionId" | "sectionTitle"> & {
  /** Set for off-site sources (GitHub, Credly, LinkedIn): rendered as an external link. */
  url?: string;
};

const PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/highlights", label: "Highlights" },
  { path: "/projects", label: "Projects" },
  { path: "/volunteer", label: "Volunteer" },
];

const CACHE_MS = 60 * 60 * 1000;
let cache: { at: number; lines: CorpusLine[] } | null = null;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", mdash: "—", ndash: "–", hellip: "…" };

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

function htmlToLines(html: string): string[] {
  const text = html
    .replace(/<(script|style|svg|iframe|noscript|form|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h[1-6]|div|td|th|dt|dd|figcaption|button|a)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decode(text)
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 1); // keep two-letter names like "CC"
}

/**
 * Removes elements marked data-search-ignore (e.g. the homepage search bar
 * and its suggestion chips) by matching their opening tag to its close.
 */
function stripIgnored(html: string): string {
  for (;;) {
    const attr = html.search(/\sdata-search-ignore(?:=""|\b)/);
    if (attr < 0) return html;
    const start = html.lastIndexOf("<", attr);
    const tag = html.slice(start + 1).match(/^[a-z0-9]+/i)?.[0];
    if (!tag) return html;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    re.lastIndex = start;
    let depth = 0;
    let end = -1;
    for (let m = re.exec(html); m; m = re.exec(html)) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    if (end < 0) return html;
    html = html.slice(0, start) + html.slice(end);
  }
}

/** Splits a page's <main> into sections (by <section id> / <header id>) and extracts their text. */
function extractPage(html: string, path: string, pageLabel: string): CorpusLine[] {
  const start = html.search(/<main\b[^>]*id="content"/i);
  const end = html.lastIndexOf("</main>");
  const main = stripIgnored(start >= 0 && end > start ? html.slice(start, end) : html);
  const parts = main.split(/(?=<(?:section|header)\b[^>]*\bid=")/i);
  const lines: CorpusLine[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const idMatch = part.match(/^<(section|header)\b[^>]*\bid="([^"]+)"/i);
    const sectionId = idMatch?.[2] ?? null;
    const h2 = part.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    const sectionTitle = idMatch?.[1].toLowerCase() === "header" ? "Intro" : h2 ? htmlToLines(h2[1]).join(" ") : pageLabel;
    for (const text of htmlToLines(part)) {
      const key = `${sectionId}|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push({ path, pageLabel, sectionId, sectionTitle, text });
    }
  }
  return lines;
}

/**
 * Fetches the public pages from this same server. The visitor's cookies are
 * forwarded so the site gate (when enabled) lets the request through.
 */
export async function getCorpus(cookie: string | null): Promise<CorpusLine[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.lines;
  const base = `http://127.0.0.1:${process.env.PORT || 3000}`;
  const pages = await Promise.all(
    PAGES.map(async ({ path, label }) => {
      const res = await fetch(base + path, {
        headers: cookie ? { cookie } : {},
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Corpus fetch ${path} -> ${res.status}`);
      return extractPage(await res.text(), path, label);
    })
  );
  const lines = pages.flat();
  cache = { at: Date.now(), lines };
  return lines;
}

const STOPWORDS = new Set(
  "a an and are as at be been but by can could did do does for from had has have he her his how i if in into is it its me my of on or our she so than that the their them then there these they this to was we were what when where which who whom why will with would you your brandon sanders brandon's about any ever tell know".split(
    " "
  )
);

export function terms(q: string): string[] {
  return [
    ...new Set(
      q
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/)
        .map((t) => t.replace(/\.+$/, ""))
        .filter((t) => t.length > 1 && !STOPWORDS.has(t))
        // Light stemming so "migrations"/"migrated" still hit "migration".
        .map((t) => (t.length > 5 ? t.replace(/(ations?|ing|ed|es|s)$/, "") : t))
    ),
  ];
}

/**
 * Picks the lines most relevant to a question (TF-IDF-ish scoring), always
 * prefixed with the intro/about lines so the model knows who Brandon is.
 */
export function retrieve(lines: CorpusLine[], question: string, maxChars = 7000): { context: string; sources: Source[] } {
  maxChars -= VENDOR_SUMMARY.length;
  const qTerms = terms(question);
  const lower = lines.map((l) => l.text.toLowerCase());
  const df = new Map(qTerms.map((t) => [t, lower.filter((l) => l.includes(t)).length]));
  const n = lines.length;

  const scored = lines
    .map((line, i) => {
      let score = 0;
      for (const t of qTerms) {
        const d = df.get(t) ?? 0;
        if (d && lower[i].includes(t)) score += Math.log(1 + n / d);
      }
      return { line, i, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

  const base = lines.filter((l) => l.path === "/" && (l.sectionId === "home" || l.sectionId === "about"));
  const picked = new Set<CorpusLine>(base);
  // Whole text of the two best-matching sections first: a hit on a section's
  // heading (e.g. "Certifications") should bring in the short items under it
  // ("CC") even though those lines don't repeat the query words.
  const sectionScore = new Map<string, number>();
  for (const s of scored) {
    const key = `${s.line.path}|${s.line.sectionId}`;
    sectionScore.set(key, (sectionScore.get(key) ?? 0) + s.score);
  }
  const topSections = [...sectionScore].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
  for (const key of topSections) {
    let added = 0;
    for (const l of lines) {
      if (`${l.path}|${l.sectionId}` !== key || added > 2500) continue;
      picked.add(l);
      added += l.text.length;
    }
  }
  for (const s of scored) picked.add(s.line);

  // Keep page/section order so related lines stay together.
  const ordered = lines.filter((l) => picked.has(l));
  let context = "";
  let lastHeader = "";
  for (const l of ordered) {
    const header = `[${l.pageLabel} › ${l.sectionTitle}]`;
    const chunk = (header !== lastHeader ? `\n${header}\n` : "") + `- ${l.text}\n`;
    if (context.length + chunk.length > maxChars) break;
    context += chunk;
    lastHeader = header;
  }

  const sources: Source[] = [];
  for (const s of scored) {
    const { path, pageLabel, sectionId, sectionTitle } = s.line;
    if (!sources.some((x) => x.path === path && x.sectionId === sectionId)) sources.push({ path, pageLabel, sectionId, sectionTitle });
    if (sources.length >= 4) break;
  }
  return { context: `${context.trim()}\n\n${VENDOR_SUMMARY}`, sources };
}
