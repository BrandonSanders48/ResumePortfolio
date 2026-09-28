"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faWandMagicSparkles, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AskAnswer, { isAskEnabled, looksLikeQuestion } from "@/components/AskAnswer";

/** Public pages the search covers, in result order. */
const PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/highlights", label: "Highlights" },
  { path: "/projects", label: "Projects" },
  { path: "/volunteer", label: "Volunteer" },
];

export type Entry = {
  path: string;
  pageLabel: string;
  sectionId: string | null;
  sectionTitle: string;
  text: string;
  lower: string;
};

const BLOCK_SELECTOR = "p,li,h1,h2,h3,h4,h5,h6,div,figcaption,td,th,dt,dd,a,button";
// [data-search-ignore] keeps UI chrome (e.g. the homepage search bar's own suggestions) out of results.
const SKIP_SELECTOR = "script,style,noscript,iframe,svg,form,[aria-hidden='true'],[data-search-ignore]";

const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * Pulls every distinct text block out of a page's <main>, tagged with the
 * section it lives in. A block's text is only its *own* text (nested blocks
 * are their own entries), so a card never duplicates the items inside it.
 * Shared by indexing (fetched HTML) and by locating a result on the live
 * page, so both sides agree on what a "block" is.
 */
function extractBlocks(main: Element): { el: Element; text: string; section: Element | null }[] {
  const walker = main.ownerDocument.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const own = new Map<Element, string[]>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP_SELECTOR)) continue;
    const el = parent.closest(BLOCK_SELECTOR);
    if (!el || !main.contains(el)) continue;
    if (!own.has(el)) own.set(el, []);
    own.get(el)!.push(node.textContent);
  }
  const blocks: { el: Element; text: string; section: Element | null }[] = [];
  for (const [el, parts] of own) {
    const text = normalize(parts.join(" "));
    if (text.length < 2) continue;
    blocks.push({ el, text, section: el.closest("section[id], header[id]") });
  }
  return blocks;
}

function sectionTitle(section: Element | null, fallback: string): string {
  if (!section) return fallback;
  if (section.tagName === "HEADER") return "Intro";
  const h = section.querySelector("h2");
  return h ? normalize(h.textContent ?? "") : fallback;
}

const OPEN_EVENT = "site-search:open";

const GO_EVENT = "site-search:go";

/** Opens the site search dialog from anywhere, optionally pre-filled. */
export function openSiteSearch(query = "") {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { query } }));
}

/**
 * Jumps to a result from outside the dialog (the homepage search box). The
 * navbar's SiteSearch persists across routes, so it owns the "navigate, wait
 * for the page to render, then scroll and highlight" step.
 */
export function goToSearchResult(entry: Entry) {
  window.dispatchEvent(new CustomEvent(GO_EVENT, { detail: entry }));
}

let indexPromise: Promise<Entry[]> | null = null;

/** Fetches and indexes the public pages once per visit. */
export function loadIndex(): Promise<Entry[]> {
  if (!indexPromise) {
    indexPromise = Promise.all(
      PAGES.map(async ({ path, label }) => {
        const res = await fetch(path, { credentials: "same-origin" });
        if (!res.ok) return [];
        const doc = new DOMParser().parseFromString(await res.text(), "text/html");
        const main = doc.querySelector("main#content") ?? doc.body;
        const entries: Entry[] = [];
        const dedupe = new Set<string>();
        for (const { text, section } of extractBlocks(main)) {
          const key = `${section?.id ?? ""}|${text}`;
          if (dedupe.has(key)) continue;
          dedupe.add(key);
          entries.push({
            path,
            pageLabel: label,
            sectionId: section?.id ?? null,
            sectionTitle: sectionTitle(section, label),
            text,
            lower: text.toLowerCase(),
          });
        }
        return entries;
      })
    )
      .then((pages) => pages.flat())
      .catch((err) => {
        indexPromise = null; // allow a retry on the next open
        throw err;
      });
  }
  return indexPromise;
}

export function search(index: Entry[], query: string): Entry[] {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { e: Entry; score: number }[] = [];
  for (const e of index) {
    if (!terms.every((t) => e.lower.includes(t))) continue;
    let score = 0;
    if (e.lower.includes(q)) score += 10;
    if (e.lower === q) score += 20;
    for (const t of terms) {
      if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(e.lower)) score += 4;
    }
    score -= Math.min(e.text.length, 400) / 100; // prefer short, specific blocks
    scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 25).map((s) => s.e);
}

/** Trims long blocks to a window around the first match and marks every term. */
export function Snippet({ text, query }: { text: string; query: string }) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let shown = text;
  if (text.length > 160) {
    const at = Math.max(0, text.toLowerCase().indexOf(terms[0] ?? "") - 60);
    shown = (at > 0 ? "…" : "") + text.slice(at, at + 160) + (at + 160 < text.length ? "…" : "");
  }
  if (!terms.length) return <>{shown}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {shown.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-accent/15 text-ink rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/** Scrolls to the block matching a result on the current page and flashes it. */
function revealResult(entry: Entry): boolean {
  const main = document.querySelector("main#content");
  if (!main) return false;
  const scope = entry.sectionId ? document.getElementById(entry.sectionId) ?? main : main;
  if (!entry.text) {
    // AI answer "related section" links carry no block text: go to the section.
    if (scope === main) return false;
    scope.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  const hit = extractBlocks(scope).find((b) => b.text === entry.text);
  if (!hit) return false;
  hit.el.scrollIntoView({ behavior: "smooth", block: "center" });
  hit.el.classList.remove("search-flash");
  void (hit.el as HTMLElement).offsetWidth; // restart the animation on repeat hits
  hit.el.classList.add("search-flash");
  window.setTimeout(() => hit.el.classList.remove("search-flash"), 2400);
  return true;
}

export default function SiteSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pending = useRef<Entry | null>(null);

  const [askEnabled, setAskEnabled] = useState(false);
  const [asked, setAsked] = useState<string | null>(null);

  const results = useMemo(() => (index ? search(index, query) : []), [index, query]);
  // "Ask AI" sits first for question-like queries, otherwise after the keyword hits.
  const showAsk = askEnabled && query.trim().length >= 3;
  const askFirst = showAsk && looksLikeQuestion(query);
  type Option = { kind: "ask" } | { kind: "result"; entry: Entry };
  const resultOptions: Option[] = results.map((entry) => ({ kind: "result", entry }));
  const options: Option[] = !showAsk ? resultOptions : askFirst ? [{ kind: "ask" }, ...resultOptions] : [...resultOptions, { kind: "ask" }];
  const optionCount = options.length;

  const openSearch = useCallback((initialQuery = "") => {
    setOpen(true);
    setQuery(initialQuery);
    setActive(0);
    setError(false);
    setAsked(null);
    loadIndex()
      .then(setIndex)
      .catch(() => setError(true));
    isAskEnabled().then(setAskEnabled);
  }, []);

  // Ctrl/Cmd+K anywhere, or "/" when not typing in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = (e.target as HTMLElement)?.closest?.("input,textarea,select,[contenteditable='true']");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openSearch();
      }
    }
    function onOpenEvent(e: Event) {
      openSearch((e as CustomEvent<{ query?: string }>).detail?.query ?? "");
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, [openSearch]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // After navigating to another page, wait for its content to render, then reveal.
  useEffect(() => {
    const entry = pending.current;
    if (!entry || entry.path !== pathname) return;
    pending.current = null;
    const started = performance.now();
    let frame = 0;
    const tick = () => {
      if (revealResult(entry) || performance.now() - started > 3000) return;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
    setAsked(null);
  }

  const go = useCallback(
    (entry: Entry) => {
      setOpen(false);
      setQuery("");
      setActive(0);
      setAsked(null);
      if (entry.path === pathname) {
        // Let the modal unmount and scroll unlock before scrolling the page.
        requestAnimationFrame(() => revealResult(entry));
      } else {
        pending.current = entry;
        router.push(entry.path);
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    const onGo = (e: Event) => go((e as CustomEvent<Entry>).detail);
    window.addEventListener(GO_EVENT, onGo);
    return () => window.removeEventListener(GO_EVENT, onGo);
  }, [go]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, optionCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[active];
      if (opt?.kind === "ask") setAsked(query.trim());
      else if (opt) go(opt.entry);
    } else if (e.key === "Escape") {
      if (asked) setAsked(null);
      else close();
    }
  }

  return (
    <>
      <button
        onClick={() => openSearch()}
        className="flex items-center gap-2 text-ink/60 hover:text-ink p-2 xl:pl-3 xl:pr-2 xl:py-1.5 rounded-lg xl:rounded-full xl:border xl:border-line xl:bg-paper/60 hover:bg-paper transition-all"
        aria-label="Search the site"
        title="Search (Ctrl+K)"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
        <span className="hidden xl:inline text-sm font-medium">Search</span>
        <kbd className="hidden xl:inline font-sans text-[0.65rem] text-ink/45 border border-line bg-white rounded px-1.5 py-0.5">Ctrl K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm flex items-start justify-center px-4 pt-20 sm:pt-24"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
          aria-label="Search the site"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl border border-line shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 border-b border-line">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-ink/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                  setAsked(null);
                }}
                onKeyDown={onInputKey}
                placeholder={askEnabled ? "Search or ask a question…" : "Search skills, vendors, companies…"}
                className="flex-1 py-4 text-[0.95rem] text-ink placeholder:text-ink/40 bg-transparent outline-none"
                aria-label="Search query"
                aria-controls="site-search-results"
                aria-activedescendant={optionCount && !asked ? `site-search-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              {askEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    if (query.trim().length >= 3) setAsked(query.trim());
                    else inputRef.current?.focus();
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 rounded-full px-2.5 py-1 transition-colors"
                  title="Ask the AI a question about my experience"
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[0.65rem]" />
                  Ask AI
                </button>
              )}
              <button onClick={close} className="text-ink/50 hover:text-ink p-1.5 -mr-1.5" aria-label="Close search">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {asked ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAsked(null)}
                    className="flex items-center gap-1.5 px-4 pt-3 text-xs font-medium text-ink/55 hover:text-ink"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[0.65rem]" /> Back to results
                  </button>
                  <AskAnswer key={asked} question={asked} onNavigate={close} />
                </>
              ) : error ? (
                <p className="px-4 py-6 text-sm text-ink/60">Search couldn&apos;t load. Please try again.</p>
              ) : !index ? (
                <p className="px-4 py-6 text-sm text-ink/60">Loading…</p>
              ) : !query.trim() ? (
                <p className="px-4 py-6 text-sm text-ink/60">
                  Try a vendor like <span className="font-medium text-ink">Proxmox</span>, a skill like{" "}
                  <span className="font-medium text-ink">HIPAA</span>
                  {askEnabled ? (
                    <>
                      , or ask a question like <span className="font-medium text-ink">&ldquo;Has he led a cloud migration?&rdquo;</span>
                    </>
                  ) : (
                    <>, or a company name</>
                  )}
                  .
                </p>
              ) : optionCount === 0 ? (
                <p className="px-4 py-6 text-sm text-ink/60">
                  No results for <span className="font-medium text-ink">&ldquo;{query.trim()}&rdquo;</span>.
                </p>
              ) : (
                <ul id="site-search-results" ref={listRef} role="listbox" className="py-2">
                  {options.map((opt, i) =>
                    opt.kind === "ask" ? (
                      <li key="ask" id={`site-search-${i}`} role="option" aria-selected={i === active} data-index={i}>
                        <button
                          onClick={() => setAsked(query.trim())}
                          onMouseMove={() => setActive(i)}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${i === active ? "bg-paper" : ""}`}
                        >
                          <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-xs" />
                          </span>
                          <span className="text-sm text-ink/80 min-w-0 truncate">
                            Ask AI: <span className="font-medium text-ink">&ldquo;{query.trim()}&rdquo;</span>
                          </span>
                        </button>
                      </li>
                    ) : (
                      <li key={`${opt.entry.path}|${opt.entry.sectionId}|${opt.entry.text}`} id={`site-search-${i}`} role="option" aria-selected={i === active} data-index={i}>
                        <button
                          onClick={() => go(opt.entry)}
                          onMouseMove={() => setActive(i)}
                          className={`w-full text-left px-4 py-2.5 transition-colors ${i === active ? "bg-paper" : ""}`}
                        >
                          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-accent mb-0.5">
                            {opt.entry.pageLabel}
                            {opt.entry.sectionTitle !== opt.entry.pageLabel && <span className="text-ink/40"> · {opt.entry.sectionTitle}</span>}
                          </div>
                          <div className="text-sm text-ink/80 leading-snug">
                            <Snippet text={opt.entry.text} query={query} />
                          </div>
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-line bg-paper/60 text-[0.7rem] text-ink/50">
              <span>
                <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to navigate
              </span>
              <span>
                <kbd className="font-sans">Enter</kbd> to open
              </span>
              <span>
                <kbd className="font-sans">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
