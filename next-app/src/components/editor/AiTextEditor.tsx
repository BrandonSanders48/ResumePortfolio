"use client";

import { useEffect, useRef, useState } from "react";

type Proposal = { original: string; content: string; edits: { before: string; after: string }[] };

export default function AiTextEditor({ content, onApply }: { content: string; onApply: (content: string) => void }) {
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function suggest() {
    const original = content;
    controller.current = new AbortController();
    setBusy(true);
    setMessage("");
    setProposal(null);
    try {
      const response = await fetch("/api/editor/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.current.signal,
        body: JSON.stringify({ content: original, instruction }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "AI editing failed.");
      if (!result.edits.length) setMessage("No text changes suggested. Try a more specific request.");
      else setProposal({ original, content: result.content, edits: result.edits });
    } catch (error) {
      if (!controller.current?.signal.aborted) setMessage(error instanceof Error ? error.message : "AI editing failed.");
    } finally { setBusy(false); }
  }

  const stale = proposal && proposal.original !== content;
  return (
    <div className="border border-line rounded-xl p-3 mb-4 bg-paper">
      <label htmlFor="ai-instruction" className="block text-sm font-semibold text-ink mb-2">Ask AI to edit text</label>
      <textarea id="ai-instruction" value={instruction} onChange={(event) => setInstruction(event.target.value)}
        maxLength={2000} rows={2} className="w-full rounded-lg border border-line bg-white p-2 text-sm"
        placeholder="e.g. Shorten the healthcare experience bullets and keep the numbers." />
      <button type="button" onClick={suggest} disabled={busy || instruction.trim().length < 3}
        className="btn-outline mt-2 disabled:opacity-60">{busy ? "Suggesting changes…" : "Suggest changes"}</button>
      <p className="text-xs text-ink/65 mt-2">Review suggestions, apply them to the live preview, then save when ready.</p>
      <div aria-live="polite" className="text-sm mt-2">{message}</div>
      {proposal && <div className="mt-3">
        <ul className="space-y-3 max-h-64 overflow-auto text-sm">
          {proposal.edits.map((edit, index) => <li key={index} className="border-t border-line pt-2">
            <p><strong>Before:</strong> {edit.before}</p>
            <p className="mt-1"><strong>After:</strong> {edit.after}</p>
          </li>)}
        </ul>
        {stale && <p role="status" className="text-sm mt-2">The document changed. Request new suggestions to keep your latest edits.</p>}
        <div className="flex gap-2 mt-3">
          <button type="button" disabled={Boolean(stale)} className="btn-primary disabled:opacity-60"
            onClick={() => { if (content === proposal.original) { onApply(proposal.content); setProposal(null); setMessage("Changes applied. Review the preview and save when ready."); } }}>Apply changes</button>
          <button type="button" className="btn-outline" onClick={() => setProposal(null)}>Discard</button>
        </div>
      </div>}
    </div>
  );
}
