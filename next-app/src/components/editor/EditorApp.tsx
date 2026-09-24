"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faFilePdf,
  faFileImage,
  faRightFromBracket,
  faCloudArrowUp,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faArrowUpRightFromSquare,
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faClock,
  faClockRotateLeft,
  faTextWidth,
  faRulerHorizontal,
  faFileZipper,
} from "@fortawesome/free-solid-svg-icons";
import type { EditorDoc, HistoryEntry } from "@/lib/editor-docs";

// Docs whose PDF export corresponds to a file actually linked from the live
// site, and the /files/ filename each one should publish as.
const PUBLISH_TARGETS: Record<string, string> = {
  "Resume.html": "Brandon-Sanders-Resume.pdf",
};

const PAGE_HEIGHT_PX = 1056; // 11in at 96dpi, matches the export's letter-size PDF pages

let toastId = 0;
type Toast = { id: number; type: "success" | "error" | "info"; message: string };

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

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "never saved";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
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
  const [docList, setDocList] = useState(docs);
  const [activeDoc, setActiveDoc] = useState(initialDoc);
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const [jobName, setJobName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [exportMode, setExportMode] = useState<"current" | "both">("current");
  const [exportOther, setExportOther] = useState(() => docs.find((d) => d.filename !== initialDoc)?.filename ?? "");
  const [pdfAlert, setPdfAlert] = useState(true);
  const [publish, setPublish] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "image">("pdf");
  const [compress, setCompress] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const [wordWrap, setWordWrap] = useState(true);
  const [showPageGuides, setShowPageGuides] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [autoFit, setAutoFit] = useState(true);

  const previewRef = useRef<HTMLIFrameElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState(420);
  const [contentWidth, setContentWidth] = useState(816); // 8.5in at 96dpi, matches the resume/cover width
  const contentRef = useRef(content);
  contentRef.current = content;

  const isDirty = content !== savedContent;
  const activeDocMeta = docList.find((d) => d.filename === activeDoc);
  // The LinkedIn banner is a fixed-size 1584x396 image design, not a paginated
  // print document, so the 11in page-break model and its height-measuring
  // logic (which fights with the banner's own min-height:100vh centering) don't apply.
  const isBanner = /banner/i.test(activeDoc);
  // The banner's actual design box, not the centering canvas around it (its
  // body uses min-height:100vh + flex centering purely so it looks right
  // when opened directly in a browser for a manual screenshot). Hardcoded
  // rather than measured: measuring it live runs into two problems at once
  // -- the flex layout shrinks .banner to fit whatever width the iframe
  // happens to have on first paint (so a too-narrow initial guess "sticks"
  // and never corrects itself), and scrollHeight is meaningless against a
  // min-height:100vh element since that resolves against whatever height we
  // hand the iframe in the first place.
  const BANNER_WIDTH = 1584;
  const BANNER_HEIGHT = 416;
  const effectiveContentWidth = isBanner ? BANNER_WIDTH : contentWidth;

  const recomputeFit = useCallback(() => {
    const container = previewContainerRef.current;
    if (!container || !effectiveContentWidth) return;
    const available = container.clientWidth - 4; // small breathing room
    const fit = Math.min(1.5, Math.max(0.15, available / effectiveContentWidth));
    setZoom(+fit.toFixed(3));
  }, [effectiveContentWidth]);

  // Re-fit whenever the measured content width changes (new doc, or its
  // natural width differs, e.g. the 1584px-wide banner vs. the 816px resume)
  // while the user hasn't manually overridden the zoom.
  useEffect(() => {
    if (autoFit) recomputeFit();
  }, [autoFit, effectiveContentWidth, recomputeFit]);

  // Re-fit on container resize (e.g. window resize, or the split layout
  // reflowing) so the preview never silently clips off the page edge.
  useEffect(() => {
    function onResize() {
      if (autoFit) recomputeFit();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [autoFit, recomputeFit]);

  // Switching documents resets to fit-to-width, since a manually-picked zoom
  // for one doc (e.g. a tall resume) rarely makes sense for another (e.g. the
  // much wider banner).
  useEffect(() => {
    setAutoFit(true);
  }, [activeDoc]);

  // The banner is a graphic, not a print document -- default it to PNG.
  // Other docs only ever support PDF.
  useEffect(() => {
    setExportFormat(isBanner ? "image" : "pdf");
  }, [isBanner]);

  const pushToast = useCallback((type: Toast["type"], message: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const previewSrcDoc = useMemo(
    () => applyTokensClient(content, { contactPhone, contactPhoneTel, contactEmail, jobName, companyName }),
    [content, contactPhone, contactPhoneTel, contactEmail, jobName, companyName]
  );

  // Warn on tab close / navigation with unsaved changes.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (contentRef.current !== savedContent) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [savedContent]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: activeDoc, content: contentRef.current }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedContent(contentRef.current);
        setDocList((list) =>
          list.map((d) => (d.filename === activeDoc ? { ...d, updatedAt: json.updatedAt ?? new Date().toISOString() } : d))
        );
        pushToast("success", `${activeDoc} saved.`);
      } else {
        pushToast("error", json.message || "Save failed.");
      }
    } catch {
      pushToast("error", "Unexpected error while saving.");
    } finally {
      setSaving(false);
    }
  }, [activeDoc, pushToast]);

  async function openHistory() {
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/editor/history?doc=${encodeURIComponent(activeDoc)}`);
      const json = await res.json();
      setHistoryEntries(json.success ? json.entries : []);
    } catch {
      setHistoryEntries([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleRestore(id: string) {
    if (isDirty) {
      const ok = window.confirm("You have unsaved changes that will be discarded by restoring. Continue?");
      if (!ok) return;
    }
    setRestoringId(id);
    try {
      const res = await fetch("/api/editor/history/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: activeDoc, id }),
      });
      const json = await res.json();
      if (json.success) {
        setContent(json.content);
        setSavedContent(json.content);
        setDocList((list) => list.map((d) => (d.filename === activeDoc ? { ...d, updatedAt: json.updatedAt } : d)));
        setHistoryOpen(false);
        pushToast("success", "Version restored.");
      } else {
        pushToast("error", json.message || "Restore failed.");
      }
    } catch {
      pushToast("error", "Unexpected error while restoring.");
    } finally {
      setRestoringId(null);
    }
  }

  const handleExportRef = useRef<() => void>(() => {});

  // Global keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+Enter to export.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      } else if (mod && e.key === "Enter") {
        e.preventDefault();
        handleExportRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  async function switchDoc(filename: string) {
    if (filename === activeDoc) return;
    if (isDirty) {
      const ok = window.confirm(`You have unsaved changes to ${activeDoc}. Switch documents anyway and lose them?`);
      if (!ok) return;
    }
    setSwitching(true);
    try {
      const res = await fetch(`/api/editor/docs?doc=${encodeURIComponent(filename)}`);
      const json = await res.json();
      if (json.success) {
        setActiveDoc(json.activeDoc);
        setContent(json.content);
        setSavedContent(json.content);
        setDocList(json.docs ?? docList);
        const other = (json.docs ?? docList).find((d: EditorDoc) => d.filename !== json.activeDoc)?.filename;
        if (other) setExportOther(other);
      } else {
        pushToast("error", json.message || "Could not switch documents.");
      }
    } catch {
      pushToast("error", "Unexpected error switching documents.");
    } finally {
      setSwitching(false);
    }
  }

  async function handleExport() {
    const isImage = isBanner && exportFormat === "image";
    const publishAs = !isImage && publish ? PUBLISH_TARGETS[activeDoc] : undefined;
    if (publishAs) {
      const ok = window.confirm(`This will overwrite the live download at /files/${publishAs} with this export. Continue?`);
      if (!ok) return;
    }
    setExporting(true);
    try {
      const res = await fetch("/api/editor/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isImage
            ? { doc: activeDoc, content, format: "image" }
            : {
                doc: activeDoc,
                content,
                mode: exportMode,
                otherDoc: exportOther,
                jobName,
                companyName,
                pdfAlert,
                publishAs,
                compress,
              }
        ),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        pushToast("error", json?.message || `${isImage ? "Image" : "PDF"} export failed.`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.href = url;
      a.download = match?.[1] || (isImage ? "export.png" : "resume.pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const publishStatus = res.headers.get("X-Publish-Status");
      if (publishAs && publishStatus === "ok") {
        pushToast("success", `PDF exported and published to /files/${publishAs}.`);
      } else if (publishAs && publishStatus?.startsWith("error:")) {
        pushToast("error", `PDF downloaded, but publishing failed: ${publishStatus.slice(6)}`);
      } else {
        pushToast("success", isImage ? "PNG exported." : "PDF exported.");
      }
    } catch {
      pushToast("error", "Unexpected error during export.");
    } finally {
      setExporting(false);
    }
  }
  handleExportRef.current = handleExport;

  async function handleLogout() {
    if (isDirty) {
      const ok = window.confirm("You have unsaved changes that will be lost. Log out anyway?");
      if (!ok) return;
    }
    await fetch("/api/editor/logout", { method: "POST" });
    router.refresh();
  }

  function openPreviewInNewTab() {
    const blob = new Blob([previewSrcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  const pageMarkers = useMemo(() => {
    const count = Math.floor(previewHeight / PAGE_HEIGHT_PX);
    return Array.from({ length: count }, (_, i) => (i + 1) * PAGE_HEIGHT_PX);
  }, [previewHeight]);

  const editorExtensions = useMemo(() => {
    // CodeMirror's contentDOM (the role="textbox" element) doesn't pick up an
    // aria-label passed as a React prop on <CodeMirror> -- it only accepts
    // one through this contentAttributes facet.
    const ext = [
      htmlLang(),
      keymap.of([{ key: "Mod-s", run: () => true }]),
      EditorView.contentAttributes.of({ "aria-label": "HTML source editor" }),
    ];
    if (wordWrap) ext.push(EditorView.lineWrapping);
    return ext;
  }, [wordWrap]);

  return (
    <div className="bg-paper min-h-[80vh] py-8 overflow-x-hidden">
      {/* Toasts */}
      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm shadow-lg bg-white ${
              t.type === "success" ? "border-accent/30 text-ink" : t.type === "error" ? "border-red-300 text-red-800" : "border-line text-ink"
            }`}
          >
            <FontAwesomeIcon
              icon={t.type === "error" ? faCircleExclamation : faCircleCheck}
              className={`mt-0.5 text-xs ${t.type === "error" ? "text-red-600" : "text-accent"}`}
            />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="text-ink/65 hover:text-ink">
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-2xl text-ink">Resume Editor</h1>
            <p className="text-ink/65 text-sm">Edit the raw HTML, preview it live, then save or export a PDF.</p>
          </div>
          <button onClick={handleLogout} className="btn-outline">
            <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" /> Logout
          </button>
        </div>

        {/* Doc tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 border-b border-line pb-3">
          {docList.map((d) => {
            const isActive = d.filename === activeDoc;
            return (
              <button
                key={d.filename}
                onClick={() => switchDoc(d.filename)}
                disabled={switching}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-60 ${
                  isActive ? "bg-ink text-white" : "bg-white text-ink/60 hover:text-ink border border-line"
                }`}
              >
                {d.label}
                {isActive && isDirty && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white" title="Unsaved changes" />
                )}
              </button>
            );
          })}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink/65">
            <FontAwesomeIcon icon={faClock} className="text-[10px]" />
            {isDirty ? "Unsaved changes" : `Saved ${formatRelativeTime(activeDocMeta?.updatedAt ?? null)}`}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 min-w-0">
          {/* Editor */}
          <div className="bg-white rounded-2xl border border-line p-5 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ink text-sm">HTML</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWordWrap((w) => !w)}
                  className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                    wordWrap ? "bg-paper text-ink" : "text-ink/65 hover:text-ink"
                  }`}
                  title="Toggle word wrap"
                >
                  <FontAwesomeIcon icon={faTextWidth} className="text-[11px]" /> Wrap
                </button>
              </div>
            </div>
            <div className="h-[50vh] lg:h-[75vh] min-h-[320px] rounded-xl border border-line overflow-hidden min-w-0">
              <CodeMirror
                value={content}
                onChange={(value) => setContent(value)}
                height="100%"
                style={{ height: "100%", fontSize: "12.5px" }}
                extensions={editorExtensions}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLine: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  searchKeymap: true,
                  history: true,
                }}
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={handleSave} disabled={saving} className="btn-primary justify-center disabled:opacity-60">
                <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={openHistory} className="btn-outline justify-center" title="View and restore earlier saved versions">
                <FontAwesomeIcon icon={faClockRotateLeft} className="text-xs" /> History
              </button>
              <span className="hidden sm:inline text-xs text-ink/65">Ctrl/Cmd+S to save &middot; Ctrl/Cmd+Enter to export</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-line p-5 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-semibold text-ink text-sm">
                Preview
                {isBanner && <span className="ml-2 text-xs font-normal text-ink/65">1584 &times; 396px design, not paginated</span>}
              </h2>
              <div className="flex items-center gap-1.5">
                {!isBanner && (
                  <button
                    onClick={() => setShowPageGuides((v) => !v)}
                    className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                      showPageGuides ? "bg-paper text-ink" : "text-ink/65 hover:text-ink"
                    }`}
                    title="Toggle page-break guides (each line marks where an 11in PDF page ends)"
                  >
                    <FontAwesomeIcon icon={faRulerHorizontal} className="text-[11px]" /> Page guides
                  </button>
                )}
                <div className="flex items-center gap-0.5 border border-line rounded-md">
                  <button
                    onClick={() => {
                      setAutoFit(false);
                      setZoom((z) => Math.max(0.15, +(z - 0.1).toFixed(2)));
                    }}
                    className="px-2 py-1 text-ink/60 hover:text-ink"
                    title="Zoom out"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="text-[11px]" />
                  </button>
                  <button
                    onClick={() => {
                      setAutoFit(true);
                      recomputeFit();
                    }}
                    className={`px-1.5 py-1 text-xs w-14 text-center ${autoFit ? "text-accent font-medium" : "text-ink/60 hover:text-ink"}`}
                    title="Fit to width"
                  >
                    {autoFit ? "Fit" : `${Math.round(zoom * 100)}%`}
                  </button>
                  <button
                    onClick={() => {
                      setAutoFit(false);
                      setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)));
                    }}
                    className="px-2 py-1 text-ink/60 hover:text-ink"
                    title="Zoom in"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="text-[11px]" />
                  </button>
                </div>
                <button
                  onClick={openPreviewInNewTab}
                  className="px-2 py-1 text-ink/60 hover:text-ink border border-line rounded-md"
                  title="Open preview in a new tab, at full size"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[11px]" />
                </button>
              </div>
            </div>
            <div
              ref={previewContainerRef}
              className="flex-1 min-h-[320px] max-h-[60vh] lg:max-h-[75vh] rounded-xl border border-line overflow-auto bg-slate-50 relative"
            >
              <div
                className="relative origin-top-left"
                style={{
                  width: effectiveContentWidth * zoom,
                  height: (isBanner ? BANNER_HEIGHT : previewHeight) * zoom,
                }}
              >
                <div
                  className="relative"
                  style={{ width: effectiveContentWidth, transform: `scale(${zoom})`, transformOrigin: "top left" }}
                >
                  <iframe
                    ref={previewRef}
                    title="Resume preview"
                    srcDoc={previewSrcDoc}
                    sandbox="allow-same-origin allow-scripts"
                    scrolling="no"
                    className="block border-0"
                    style={{ width: isBanner ? BANNER_WIDTH : contentWidth, height: isBanner ? BANNER_HEIGHT : previewHeight }}
                    onLoad={() => {
                      if (isBanner) return; // fixed dimensions above; see BANNER_WIDTH/BANNER_HEIGHT comment
                      const doc = previewRef.current?.contentDocument;
                      if (!doc?.documentElement) return;

                      const measure = () => {
                        const firstEl = doc.body?.firstElementChild as HTMLElement | null;
                        const measuredWidth = firstEl?.getBoundingClientRect().width || doc.documentElement.scrollWidth;
                        if (measuredWidth) setContentWidth(Math.ceil(measuredWidth));
                        setPreviewHeight(doc.documentElement.scrollHeight);
                      };
                      measure();

                      // Self-hosted @font-face swaps in after this fires (the whole point of
                      // font-display: swap), which reflows text height -- most noticeable on a
                      // slow connection or cold cache. Re-measure once the real fonts land so
                      // the page-end guides don't drift out of sync with a taller/shorter page.
                      doc.fonts?.ready.then(measure).catch(() => {});
                    }}
                  />
                  {!isBanner &&
                    showPageGuides &&
                    pageMarkers.map((top, i) => (
                      <div key={top} className="absolute left-0 right-0 pointer-events-none" style={{ top, width: effectiveContentWidth }}>
                        <div className="border-t-2 border-dashed border-red-400/70" />
                        <span className="absolute right-1 -top-4 text-[10px] font-medium text-red-500 bg-white/90 px-1 rounded">
                          page {i + 1} ends
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl border border-line overflow-hidden mt-6">
          <div className="px-5 py-4 border-b border-line flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink text-sm">Export</h2>
              <p className="text-xs text-ink/65 mt-0.5">
                {isBanner ? "Download the banner as an image, ready to upload to LinkedIn." : "Tailor it to a role, then export a PDF."}
              </p>
            </div>
            {isBanner && (
              <div className="flex items-center gap-0.5 border border-line rounded-lg p-0.5 bg-paper" role="group" aria-label="Export format">
                <button
                  onClick={() => setExportFormat("image")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    exportFormat === "image" ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  <FontAwesomeIcon icon={faFileImage} className="text-[11px]" /> PNG
                </button>
                <button
                  onClick={() => setExportFormat("pdf")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    exportFormat === "pdf" ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  <FontAwesomeIcon icon={faFilePdf} className="text-[11px]" /> PDF
                </button>
              </div>
            )}
          </div>

          <div className="p-5">
            {!isBanner && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
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
                <div className="h-px bg-line mb-5" />
              </>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-wrap items-end gap-3">
                {!isBanner && (
                  <>
                    <div className="w-full sm:w-auto">
                      <label htmlFor="exportMode" className="block text-sm font-medium text-ink/70 mb-1.5">
                        Scope
                      </label>
                      <select
                        id="exportMode"
                        className="form-input w-full sm:w-auto"
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
                      <div className="w-full sm:w-auto">
                        <label htmlFor="exportOther" className="block text-sm font-medium text-ink/70 mb-1.5">
                          Combine with
                        </label>
                        <select
                          id="exportOther"
                          className="form-input w-full sm:w-auto"
                          value={exportOther}
                          onChange={(e) => setExportOther(e.target.value)}
                        >
                          {docList
                            .filter((d) => d.filename !== activeDoc)
                            .map((d) => (
                              <option key={d.filename} value={d.filename}>
                                {d.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>

              <button onClick={handleExport} disabled={exporting} className="btn-primary justify-center w-full sm:w-auto disabled:opacity-60">
                <FontAwesomeIcon icon={isBanner && exportFormat === "image" ? faFileImage : faFilePdf} className="text-xs" />
                {exporting ? "Exporting…" : isBanner ? (exportFormat === "image" ? "Export PNG" : "Export PDF") : "Export PDF"}
              </button>
            </div>

            {!isBanner && (
              <div className="flex flex-col gap-3 mt-5 pt-4 border-t border-line">
                <label className="flex items-center gap-2 text-sm text-ink/70">
                  <input type="checkbox" checked={pdfAlert} onChange={(e) => setPdfAlert(e.target.checked)} />
                  Enable PDF app alert (when configured)
                </label>

                <label className="flex items-center gap-2 text-sm text-ink/70">
                  <input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} />
                  <FontAwesomeIcon icon={faFileZipper} className="text-xs text-accent" />
                  Compress images (much smaller file, slightly softer photo)
                </label>

                {exportMode === "current" && PUBLISH_TARGETS[activeDoc] && (
                  <label className="flex items-center gap-2 text-sm text-ink/70">
                    <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-xs text-accent" />
                    Also publish this export as the live{" "}
                    <code className="text-xs bg-paper px-1 py-0.5 rounded">/files/{PUBLISH_TARGETS[activeDoc]}</code> download
                  </label>
                )}
              </div>
            )}

            {isBanner && exportFormat === "image" && (
              <p className="text-xs text-ink/65 mt-4">
                PNG is recommended here: the banner is flat colors and sharp text/logo edges, exactly what JPEG&apos;s lossy compression
                smudges. PNG stays pixel-perfect at a full 1584&times;396.
              </p>
            )}

            {isDirty && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-3">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-[11px]" />
                Unsaved edits export too, but won&apos;t be on disk until you Save.
              </p>
            )}
          </div>
        </div>
      </div>

      {historyOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="historyModalLabel">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setHistoryOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-line flex flex-col">
            <div className="bg-paper border-b border-line px-5 py-3.5 flex items-center justify-between shrink-0">
              <div id="historyModalLabel" className="font-serif text-ink text-base">
                Version history &middot; {activeDocMeta?.label ?? activeDoc}
              </div>
              <button onClick={() => setHistoryOpen(false)} className="text-ink/65 hover:text-ink transition-colors" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-2">
              {historyLoading && <p className="text-sm text-ink/65 text-center py-6">Loading…</p>}
              {!historyLoading && historyEntries.length === 0 && (
                <p className="text-sm text-ink/65 text-center py-6">
                  No earlier versions yet. Every Save (after the first) keeps a snapshot of what it replaced.
                </p>
              )}
              {historyEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-line">
                  <div>
                    <div className="text-sm text-ink font-medium">{formatRelativeTime(entry.updatedAt)}</div>
                    <div className="text-xs text-ink/65">
                      {new Date(entry.updatedAt).toLocaleString()} &middot; {(entry.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(entry.id)}
                    disabled={restoringId === entry.id}
                    className="px-3 py-1.5 rounded-full border border-line text-xs font-medium text-ink hover:border-ink/40 transition-colors disabled:opacity-60 shrink-0"
                  >
                    {restoringId === entry.id ? "Restoring…" : "Restore"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
