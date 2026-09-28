"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { goToSearchResult } from "@/components/SiteSearch";

type Source = { path: string; pageLabel: string; sectionId: string | null; sectionTitle: string };

let enabledPromise: Promise<boolean> | null = null;

/** Whether the server has an Ollama backend configured (checked once per visit). */
export function isAskEnabled(): Promise<boolean> {
  enabledPromise ??= fetch("/api/ask")
    .then((r) => r.json())
    .then((d) => Boolean(d.enabled))
    .catch(() => false);
  return enabledPromise;
}

/** Heuristic for defaulting Enter to "Ask AI" instead of the top keyword match. */
export function looksLikeQuestion(q: string): boolean {
  const t = q.trim().toLowerCase();
  return t.endsWith("?") || /^(who|what|when|where|why|how|does|do|did|has|have|is|are|can|could|was|were|tell|which)\b/.test(t);
}

/** Streams an answer from /api/ask for one question and renders it with its sources. */
export default function AskAnswer({ question, onNavigate }: { question: string; onNavigate?: () => void }) {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<"loading" | "streaming" | "done" | "error">("loading");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    // First question after the model has been idle waits for it to load into the GPU.
    const slowTimer = window.setTimeout(() => setSlow(true), 4000);
    (async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "AI answers are not available right now.");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            const msg = JSON.parse(line);
            if (msg.type === "sources") setSources(msg.sources);
            else if (msg.type === "token") {
              window.clearTimeout(slowTimer);
              setStatus("streaming");
              setAnswer((a) => a + msg.text);
            } else if (msg.type === "error") throw new Error(msg.message);
          }
        }
        setStatus("done");
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      } finally {
        window.clearTimeout(slowTimer);
      }
    })();
    return () => {
      ctrl.abort();
      window.clearTimeout(slowTimer);
    };
  }, [question]);

  return (
    <div className="px-4 py-4" aria-live="polite">
      <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-accent mb-2">
        <FontAwesomeIcon icon={faWandMagicSparkles} />
        AI answer
      </div>

      {status === "error" ? (
        <p className="text-sm text-ink/70">{error}</p>
      ) : status === "loading" ? (
        <p className="text-sm text-ink/60 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          {slow ? "Waking up the AI server. The first answer can take up to a minute…" : "Thinking…"}
        </p>
      ) : (
        <p className="text-[0.95rem] text-ink/85 leading-relaxed whitespace-pre-wrap">
          {answer}
          {status === "streaming" && <span className="inline-block w-1.5 h-4 bg-accent/60 align-text-bottom ml-0.5 animate-pulse" />}
        </p>
      )}

      {status === "done" && sources.length > 0 && (
        <div className="mt-4">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink/45 mb-2">Related sections</div>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <button
                key={`${s.path}|${s.sectionId}`}
                type="button"
                onClick={() => {
                  onNavigate?.();
                  goToSearchResult({ ...s, text: "", lower: "" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/70 hover:text-ink border border-line hover:border-accent/40 rounded-full px-2.5 py-1 transition-colors"
              >
                {s.pageLabel}
                {s.sectionTitle !== s.pageLabel && <span className="text-ink/45">· {s.sectionTitle}</span>}
                <FontAwesomeIcon icon={faArrowRight} className="text-[0.6rem] text-ink/40" />
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-[0.7rem] text-ink/45 leading-relaxed">
        Generated by an AI model running on my self-hosted server, using only this site&apos;s content. It can make mistakes.
      </p>
    </div>
  );
}
