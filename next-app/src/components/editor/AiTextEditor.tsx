"use client";

import { useEffect, useRef, useState } from "react";
import { readEditorAiResponse } from "@/lib/editor-ai-response";

type Target = { jobName: string; companyName: string };
type Proposal = { original: string; originalTarget: string; content: string; edits: { before: string; after: string }[]; target: Target | null };

export default function AiTextEditor({ content, target, onApply, onTargetChange, onReview }: {
  content: string; target: Target; onApply: (content: string) => void; onTargetChange: (target: Target) => void; onReview: () => void;
}) {
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [conversation, setConversation] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function suggest() {
    const original = content;
    const originalTarget = JSON.stringify(target);
    const request = conversation ? `${conversation}\nUser: ${instruction}` : instruction;
    if (request.length > 2000) { setMessage("This conversation is too long. Start a new request with the job details included."); return; }
    controller.current = new AbortController();
    setBusy(true);
    setMessage("");
    setProposal(null);
    setMessages((previous) => [...previous, { role: "user", text: instruction }]);
    try {
      const response = await fetch("/api/editor/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: controller.current.signal,
        body: JSON.stringify({ content: original, instruction: request, target }),
      });
      const result = await readEditorAiResponse(response);
      if (result.question) {
        const followUp = result.question;
        setConversation(`${request}\nAI: ${followUp}`);
        setQuestion(followUp);
        setInstruction("");
        setMessages((previous) => [...previous, { role: "assistant", text: followUp }]);
      } else {
        setQuestion("");
        setConversation("");
        if (!result.edits.length && !result.target) setMessage("No text changes suggested. Try a more specific request.");
        else setProposal({ original, originalTarget, content: result.content!, edits: result.edits, target: result.target ?? null });
      }
    } catch (error) {
      if (!controller.current?.signal.aborted) setMessage(error instanceof Error ? error.message : "AI editing failed.");
    } finally { setBusy(false); }
  }

  const stale = proposal && (proposal.original !== content || proposal.originalTarget !== JSON.stringify(target));
  return (
    <div className="flex flex-col min-h-[420px] lg:min-h-[65vh]">
      <div className="p-4 sm:p-5 flex-1 space-y-4 lg:max-h-[55vh] overflow-y-auto break-words" aria-label="Writing conversation">
        <div className="rounded-2xl rounded-tl-sm bg-paper/70 p-4 text-sm leading-relaxed text-ink/80">
          <p className="font-medium text-ink mb-1">What would you like to work on?</p>
          <p>Tailor your document to a role, tighten a bullet, or try a different tone. I’ll suggest changes for you to review.</p>
        </div>
        {!messages.length && <div className="grid gap-2">
          <button type="button" disabled={busy} className="min-h-11 border border-accent/25 rounded-xl px-3 py-2.5 text-sm text-accent text-left hover:bg-accent/5 disabled:opacity-60"
            onClick={() => { const prompt = "What job title and company are you applying to?"; setConversation(`Tailor this document to a job.\nAI: ${prompt}`); setQuestion(prompt); setMessages([{ role: "user", text: "Tailor this to a job" }, { role: "assistant", text: prompt }]); setInstruction(""); setProposal(null); setMessage(""); }}>Tailor to a job <span aria-hidden="true" className="float-right">↗</span></button>
          {["Make the experience bullets more concise", "Improve the professional summary"].map((prompt) => <button key={prompt} type="button" disabled={busy} onClick={() => setInstruction(prompt)}
            className="min-h-11 border border-line rounded-xl px-3 py-2.5 text-sm text-ink/70 text-left hover:bg-paper/50 disabled:opacity-60">{prompt}</button>)}
        </div>}
        <div role="log" aria-label="Conversation messages" className="space-y-3">
          {messages.map((entry, index) => <div key={index} className={`text-sm leading-relaxed rounded-2xl px-4 py-3 ${entry.role === "user" ? "ml-5 bg-ink text-white rounded-br-sm" : "mr-3 bg-paper/70 text-ink/80 rounded-tl-sm"}`}>
            <span className="block text-[10px] uppercase tracking-wider mb-1 opacity-60">{entry.role === "user" ? "You" : "Assistant"}</span>{entry.text}
          </div>)}
        </div>
        {busy && <p role="status" className="text-sm text-accent animate-pulse">Working on your document…</p>}
        <div aria-live="polite" className="text-sm text-ink/75">{message}</div>
        {proposal && <div className="border border-accent/25 rounded-xl overflow-hidden">
          <div className="bg-accent/5 px-4 py-3"><h3 className="text-sm font-semibold">Review suggested changes</h3>
            <p className="text-xs text-ink/60 mt-1">{proposal.edits.length} text {proposal.edits.length === 1 ? "edit" : "edits"}{proposal.target ? " · Job details updated" : ""}</p></div>
          <div className="p-4">
            {proposal.target && <p className="text-sm mb-3"><strong>Target:</strong> {proposal.target.jobName || "Generic role"}{proposal.target.companyName ? ` at ${proposal.target.companyName}` : ""}</p>}
            <ul className="space-y-4 text-sm">
              {proposal.edits.map((edit, index) => <li key={index}>
                <p className="text-xs font-medium text-ink/50 mb-1">Before</p><p className="text-ink/60">{edit.before}</p>
                <p className="text-xs font-medium text-accent mb-1 mt-2">After</p><p className="text-ink">{edit.after}</p>
              </li>)}
            </ul>
            {stale && <p role="status" className="text-sm mt-3 text-amber-800">The document changed. Request new suggestions to keep your latest edits.</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              <button type="button" disabled={Boolean(stale)} className="btn-primary min-h-11 disabled:opacity-60"
                onClick={() => { if (!stale) { onApply(proposal.content); if (proposal.target) onTargetChange(proposal.target); setProposal(null); setInstruction(""); setMessage("Changes applied. Review the preview, then save when ready."); onReview(); } }}>Apply &amp; review</button>
              <button type="button" className="btn-outline min-h-11" onClick={() => setProposal(null)}>Discard</button>
            </div>
          </div>
        </div>}
      </div>
      <div className="border-t border-line p-4 sm:p-5 bg-paper/30">
        {(target.jobName || target.companyName) && <p className="text-xs text-accent mb-3 break-words">For {target.jobName || "a general role"}{target.companyName ? ` at ${target.companyName}` : ""}</p>}
        <form onSubmit={(event) => { event.preventDefault(); if (!busy && instruction.trim().length >= 3) void suggest(); }}>
          <label htmlFor="ai-instruction" className="sr-only">Ask AI to edit text</label>
          <textarea id="ai-instruction" value={instruction} onChange={(event) => setInstruction(event.target.value)}
            maxLength={2000} rows={3} className="w-full resize-y min-h-24 rounded-xl border border-line bg-white p-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder={question ? "Your reply…" : "Ask for a change, or paste a job description…"} />
          <div className="flex justify-between items-center gap-2 mt-2">
            <button type="button" disabled={busy} className="text-xs text-ink/60 min-h-11 px-1 disabled:opacity-60"
              onClick={() => { setConversation(""); setQuestion(""); setMessages([]); setInstruction(""); setMessage(""); setProposal(null); }}>New conversation</button>
            <button type="submit" disabled={busy || instruction.trim().length < 3} className="btn-primary min-h-11 disabled:opacity-60">{busy ? "Thinking…" : question ? "Send reply" : "Suggest changes"}</button>
          </div>
        </form>
        <p className="text-[11px] text-ink/50 mt-2">Suggestions only. You choose what to apply.</p>
      </div>
    </div>
  );
}
