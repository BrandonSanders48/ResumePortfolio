"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faFilePdf, faRightFromBracket, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import type { EditorDoc } from "@/lib/editor-docs";

// Docs whose PDF export corresponds to a file actually linked from the live
// site, and the /files/ filename each one should publish as.
const PUBLISH_TARGETS: Record<string, string> = {
  "Resume.html": "Brandon-Sanders-Resume.pdf",
};

function applyTokensClient(
  html: string,
  opts: { contactPhone: string; contactPhoneTel: string; contactEmail: string; jobName: string; companyName: string }
): string {
  const job = opts.jobName.trim() || "IT";
  const companyAt = opts.companyName.trim() ? ` at ${opts.companyName.trim()}` : "";
  return html
    .split("{{CONTACT_PHONE_NUMBER}}").join(opts.contactPhone)
    .split("{{CONTACT_PHONE_NUMBER_TEL}}").join(opts.contactPhoneTel || opts.contactPhone)
    .split("{{CONTACT_EMAIL}}").join(opts.contactEmail)
    .split("{{CONTACT_EMAIL_MAILTO}}").join(opts.contactEmail)
    .split("{{TARGET_JOB_TITLE}}").join(job)
    .split("{{TARGET_COMPANY_NAME}}").join(opts.companyName.trim())
    .split("{{TARGET_COMPANY_AT}}").join(companyAt)
    .split("{{TARGET_HIRING_TEAM_AT}}").join(companyAt);
}

export default function EditorApp({
  docs,
  initialDoc,
  initialContent,
  contactPhone = "",
  contactPhoneTel = "",
  contactEmail = "",
}: {
  docs: EditorDoc[];
  initialDoc: string;
  initialContent: string;
  contactPhone?: string;
  contactPhoneTel?: string;
  contactEmail?: string;
}) {
  const router = useRouter();
  const [activeDoc, setActiveDoc] = useState(initialDoc);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const [jobName, setJobName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [exportMode, setExportMode] = useState<"current" | "both">("current");
  const [exportOther, setExportOther] = useState(() => docs.find((d) => d.filename !== initialDoc)?.filename ?? "");
  const [pdfAlert, setPdfAlert] = useState(true);
  const [publish, setPublish] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [previewHeight, setPreviewHeight] = useState(420);

  const previewSrcDoc = useMemo(
    () => applyTokensClient(content, { contactPhone, contactPhoneTel, contactEmail, jobName, companyName }),
    [content, contactPhone, contactPhoneTel, contactEmail, jobName, companyName]
  );

  async function switchDoc(filename: string) {
    setSwitching(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/editor/docs?doc=${encodeURIComponent(filename)}`);
      const json = await res.json();
      if (json.success) {
        setActiveDoc(json.activeDoc);
        setContent(json.content);
        const other = docs.find((d) => d.filename !== json.activeDoc)?.filename;
        if (other) setExportOther(other);
      }
    } finally {
      setSwitching(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: activeDoc, content }),
      });
      const json = await res.json();
      setStatus({ type: json.success ? "success" : "error", message: json.message });
    } catch {
      setStatus({ type: "error", message: "Unexpected error while saving." });
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    setStatus(null);
    const publishAs = publish ? PUBLISH_TARGETS[activeDoc] : undefined;
    try {
      const res = await fetch("/api/editor/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc: activeDoc,
          content,
          mode: exportMode,
          otherDoc: exportOther,
          jobName,
          companyName,
          pdfAlert,
          publishAs,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setStatus({ type: "error", message: json?.message || "PDF export failed." });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.href = url;
      a.download = match?.[1] || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const publishStatus = res.headers.get("X-Publish-Status");
      if (publishAs && publishStatus === "ok") {
        setStatus({ type: "success", message: `PDF exported and published to /files/${publishAs}.` });
      } else if (publishAs && publishStatus?.startsWith("error:")) {
        setStatus({ type: "error", message: `PDF downloaded, but publishing failed: ${publishStatus.slice(6)}` });
      } else {
        setStatus({ type: "success", message: "PDF exported." });
      }
    } catch {
      setStatus({ type: "error", message: "Unexpected error during export." });
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/editor/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="bg-paper min-h-[80vh] py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-2xl text-ink">Resume Editor</h1>
            <p className="text-ink/50 text-sm">Edit the raw HTML, preview it live, then save or export a PDF.</p>
          </div>
          <button onClick={handleLogout} className="btn-outline">
            <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" /> Logout
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label htmlFor="docSelect" className="text-sm text-ink/60">
            Document
          </label>
          <select
            id="docSelect"
            className="form-input w-auto"
            value={activeDoc}
            disabled={switching}
            onChange={(e) => switchDoc(e.target.value)}
          >
            {docs.map((d) => (
              <option key={d.filename} value={d.filename}>
                {d.label}
              </option>
            ))}
          </select>
          {status && (
            <span className={`text-sm ${status.type === "success" ? "text-accent" : "text-red-700"}`}>{status.message}</span>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white rounded-2xl border border-line p-5 flex flex-col">
            <h2 className="font-semibold text-ink text-sm mb-3">HTML</h2>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              className="form-input flex-1 min-h-[420px] font-mono text-xs leading-relaxed resize-y"
            />
            <button onClick={handleSave} disabled={saving} className="btn-primary justify-center mt-4 disabled:opacity-60">
              <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" /> {saving ? "Saving…" : "Save"}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-line p-5 flex flex-col">
            <h2 className="font-semibold text-ink text-sm mb-3">Preview</h2>
            <div className="flex-1 min-h-[420px] max-h-[75vh] rounded-xl border border-line overflow-y-auto bg-slate-50">
              <iframe
                ref={previewRef}
                title="Resume preview"
                srcDoc={previewSrcDoc}
                sandbox="allow-same-origin allow-scripts"
                scrolling="no"
                className="w-full block border-0"
                style={{ height: previewHeight }}
                onLoad={() => {
                  const doc = previewRef.current?.contentDocument;
                  if (doc?.documentElement) {
                    setPreviewHeight(doc.documentElement.scrollHeight);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl border border-line p-5 mt-6">
          <h2 className="font-semibold text-ink text-sm mb-4">Export</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="jobName" className="block text-sm font-medium text-ink/70 mb-1.5">
                Job title
              </label>
              <input
                id="jobName"
                type="text"
                className="form-input"
                placeholder="e.g., Senior Cybersecurity Analyst"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                maxLength={120}
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-ink/70 mb-1.5">
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                className="form-input"
                placeholder="e.g., Example Health"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                maxLength={120}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 mb-3">
            <div>
              <label htmlFor="exportMode" className="block text-sm font-medium text-ink/70 mb-1.5">
                Export
              </label>
              <select
                id="exportMode"
                className="form-input w-auto"
                value={exportMode}
                onChange={(e) => {
                  const mode = e.target.value as "current" | "both";
                  setExportMode(mode);
                  if (mode !== "current") setPublish(false);
                }}
              >
                <option value="current">This document</option>
                <option value="both">This + another</option>
              </select>
            </div>
            {exportMode === "both" && (
              <div>
                <label htmlFor="exportOther" className="block text-sm font-medium text-ink/70 mb-1.5">
                  Combine with
                </label>
                <select id="exportOther" className="form-input w-auto" value={exportOther} onChange={(e) => setExportOther(e.target.value)}>
                  {docs
                    .filter((d) => d.filename !== activeDoc)
                    .map((d) => (
                      <option key={d.filename} value={d.filename}>
                        {d.label}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <button onClick={handleExport} disabled={exporting} className="btn-outline disabled:opacity-60">
              <FontAwesomeIcon icon={faFilePdf} className="text-xs" /> {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/70 mb-2">
            <input type="checkbox" checked={pdfAlert} onChange={(e) => setPdfAlert(e.target.checked)} />
            Enable PDF app alert (when configured)
          </label>

          {exportMode === "current" && PUBLISH_TARGETS[activeDoc] && (
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-xs text-accent" />
              Also publish this export as the live <code className="text-xs bg-paper px-1 py-0.5 rounded">/files/{PUBLISH_TARGETS[activeDoc]}</code> download
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
