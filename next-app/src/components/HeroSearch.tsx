"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faWandMagicSparkles, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AskAnswer, { isAskEnabled, looksLikeQuestion } from "@/components/AskAnswer";
import { goToSearchResult, loadIndex, openSiteSearch, search, Snippet, type Entry } from "@/components/SiteSearch";

const SUGGESTIONS = ["Proxmox", "HIPAA", "Kubernetes", "Fortinet"];
const MAX_INLINE = 6;

/**
 * Homepage search: a real input with results in a dropdown underneath.
 * Shares the index and ranking with the navbar's search dialog, and hands
 * "see all" off to that dialog.
 */
export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [askEnabled, setAskEnabled] = useState(false);
  const [asked, setAsked] = useState<string | null>(null);
  // Set when "Ask AI" is clicked with nothing typed: shows an example instead.
  const [askHint, setAskHint] = useState(false);

  // Check up front so the "Ask AI" button is visible before the box is used.
  useEffect(() => {
    isAskEnabled().then(setAskEnabled);
  }, []);

  const all = useMemo(() => (index ? search(index, query) : []), [index, query]);
  const results = all.slice(0, MAX_INLINE);
  const showDropdown = focused && (query.trim().length > 0 || asked !== null || askHint);
  // "Ask AI" sits first for question-like queries, otherwise after the keyword hits.
  const showAsk = askEnabled && query.trim().length >= 3;
  const askFirst = showAsk && looksLikeQuestion(query);
  type Option = { kind: "ask" } | { kind: "result"; entry: Entry };
  const resultOptions: Option[] = results.map((entry) => ({ kind: "result", entry }));
  const options: Option[] = !showAsk ? resultOptions : askFirst ? [{ kind: "ask" }, ...resultOptions] : [...resultOptions, { kind: "ask" }];
  const optionCount = options.length;

  function ensureIndex() {
    isAskEnabled().then(setAskEnabled);
    if (index) return;
    setError(false);
    loadIndex()
      .then(setIndex)
      .catch(() => setError(true));
  }

  // Close the dropdown when clicking anywhere outside the search box.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setActive(0);
    setAsked(null);
    setAskHint(false);
  }

  function askNow() {
    setFocused(true);
    ensureIndex();
    if (query.trim().length >= 3) {
      setAsked(query.trim());
    } else {
      setAskHint(true);
      inputRef.current?.focus();
    }
  }

  function pick(entry: Entry) {
    setFocused(false);
    inputRef.current?.blur();
    goToSearchResult(entry);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
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
      else if (opt) pick(opt.entry);
    } else if (e.key === "Escape") {
      if (asked) setAsked(null);
      else if (query) updateQuery("");
      else inputRef.current?.blur();
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl mx-auto lg:mx-0 mt-2 mb-10" data-search-ignore>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/95 backdrop-blur px-4 shadow-sm focus-within:border-accent/50 focus-within:shadow transition-all">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-accent" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => {
            setFocused(true);
            ensureIndex();
          }}
          onKeyDown={onKey}
          placeholder={askEnabled ? "Search or ask a question…" : "Search skills, vendors, companies…"}
          className="flex-1 min-w-0 py-3.5 text-[0.95rem] text-ink placeholder:text-ink/40 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden"
          aria-label="Search this site"
          aria-expanded={showDropdown}
          aria-controls="hero-search-results"
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              updateQuery("");
              inputRef.current?.focus();
            }}
            className="text-ink/40 hover:text-ink p-1 -mr-1"
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        {askEnabled && (
          <button type="button" onClick={askNow} className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 rounded-full px-2.5 py-1 transition-colors" title="Ask the AI a question about my experience">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[0.65rem]" />
            Ask AI
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[3.6rem] mt-2 z-30 bg-white rounded-2xl border border-line shadow-xl overflow-hidden text-left">
          {askHint && !query.trim() && !asked ? (
            <p className="px-4 py-4 text-sm text-ink/60">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-accent mr-1.5" />
              Type a question, then press Enter. For example:{" "}
              <span className="font-medium text-ink">&ldquo;Has he led a VMware migration?&rdquo;</span>
            </p>
          ) : asked ? (
            <div className="max-h-[26rem] overflow-y-auto">
              <button
                type="button"
                onClick={() => setAsked(null)}
                className="flex items-center gap-1.5 px-4 pt-3 text-xs font-medium text-ink/55 hover:text-ink"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-[0.65rem]" /> Back to results
              </button>
              <AskAnswer key={asked} question={asked} onNavigate={() => setFocused(false)} />
            </div>
          ) : error ? (
            <p className="px-4 py-4 text-sm text-ink/60">Search couldn&apos;t load. Please try again.</p>
          ) : !index ? (
            <p className="px-4 py-4 text-sm text-ink/60">Loading…</p>
          ) : optionCount === 0 ? (
            <p className="px-4 py-4 text-sm text-ink/60">
              No results for <span className="font-medium text-ink">&ldquo;{query.trim()}&rdquo;</span>.
            </p>
          ) : (
            <>
              <ul id="hero-search-results" role="listbox" className="py-1.5 max-h-80 overflow-y-auto">
                {options.map((opt, i) =>
                  opt.kind === "ask" ? (
                    <li key="ask" role="option" aria-selected={i === active}>
                      <button
                        type="button"
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
                    <li key={`${opt.entry.path}|${opt.entry.sectionId}|${opt.entry.text}`} role="option" aria-selected={i === active}>
                      <button
                        type="button"
                        onClick={() => pick(opt.entry)}
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
              {all.length > MAX_INLINE && (
                <button
                  type="button"
                  onClick={() => {
                    setFocused(false);
                    openSiteSearch(query);
                  }}
                  className="w-full px-4 py-2.5 border-t border-line bg-paper/60 text-xs font-semibold text-accent hover:bg-paper text-left"
                >
                  See all {all.length} results
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3.5 justify-center lg:justify-start">
        <span className="text-xs text-ink/45">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              updateQuery(s);
              setFocused(true);
              ensureIndex();
              inputRef.current?.focus();
            }}
            className="text-xs font-medium text-ink/65 hover:text-ink border border-line bg-white/80 hover:border-accent/40 rounded-full px-3 py-1 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
