"use client";

import { useSyncExternalStore } from "react";
import type { TechnicalHighlight } from "@/lib/content";

type Wording = "technical" | "plain";
const STORAGE_KEY = "highlightsWording";
const CHANGE_EVENT = "highlights-wording-change";

// The visitor's choice, remembered on this device. localStorage is a
// convenience: when it's blocked (private mode), the in-memory value still
// makes the toggle work for this visit.
let memory: Wording = "technical";

function readWording(): Wording {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "plain" || saved === "technical") return saved;
  } catch {
    // Storage blocked: fall back to memory.
  }
  return memory;
}

function writeWording(value: Wording) {
  memory = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Ignore: memory already holds it.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const OPTIONS: { value: Wording; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "plain", label: "Plain English" },
];

/**
 * Technical highlights with a switch between the original technical wording
 * and a plain-English version for non-technical readers (recruiters, HR).
 * Server-renders the technical wording, so search and the AI index that.
 */
export default function TechnicalHighlightsList({ items, intro }: { items: TechnicalHighlight[]; intro: string }) {
  // Server snapshot is always "technical", so the prerendered HTML matches hydration.
  const wording = useSyncExternalStore(subscribe, readWording, () => "technical" as Wording);
  const choose = writeWording;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-white/55 text-sm">{intro}</p>
        <div
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-0.5 p-1 rounded-full border border-white/15 bg-white/[0.06]"
          role="group"
          aria-label="Wording"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => choose(o.value)}
              aria-pressed={wording === o.value}
              className={`px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-semibold transition-colors ${
                wording === o.value ? "bg-white text-ink" : "text-white/65 hover:text-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid md:grid-cols-2 gap-3" aria-live="polite">
        {items.map((item) => (
          <li
            key={item.technical}
            className="relative pl-12 pr-3.5 py-3.5 rounded-xl border border-white/12 bg-white/[0.04] text-white/80 text-sm leading-relaxed hover:border-accent/40 hover:bg-white/[0.06] transition-colors"
          >
            <span className="absolute left-3.5 top-3.5 w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[0.65rem] text-white/70">
              ✓
            </span>
            {item[wording]}
          </li>
        ))}
      </ul>
    </>
  );
}
