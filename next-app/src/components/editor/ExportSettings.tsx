"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCloudArrowUp, faFileImage, faFilePdf, faSliders } from "@fortawesome/free-solid-svg-icons";

type Props = {
  open: boolean;
  onToggle: () => void;
  isBanner: boolean;
  format: "pdf" | "image";
  onFormatChange: (format: "pdf" | "image") => void;
  mode: "current" | "both";
  onModeChange: (mode: "current" | "both") => void;
  otherDoc: string;
  onOtherDocChange: (doc: string) => void;
  otherDocs: { filename: string; label: string }[];
  pdfAlert: boolean;
  onPdfAlertChange: (value: boolean) => void;
  compress: boolean;
  onCompressChange: (value: boolean) => void;
  publish: boolean;
  onPublishChange: (value: boolean) => void;
  publishTarget?: string;
  dirty: boolean;
  exporting: boolean;
  onExport: () => void;
};

function Option({ title, description, checked, onChange }: {
  title: string; description: string; checked: boolean; onChange: (value: boolean) => void;
}) {
  return <label className="flex items-start gap-3 rounded-xl border border-line p-4 cursor-pointer hover:bg-paper/40 transition-colors min-w-0 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40">
    <span className="flex-1 min-w-0"><span className="block text-sm font-medium text-ink">{title}</span><span className="block text-xs text-ink/60 leading-relaxed mt-1">{description}</span></span>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
  </label>;
}

export default function ExportSettings(props: Props) {
  const isImage = props.isBanner && props.format === "image";
  const summary = isImage ? "PNG image" : !props.isBanner && props.mode === "both" ? "Combined PDF" : "PDF document";
  return <section className="mt-5 bg-white rounded-2xl border border-line overflow-hidden" aria-label="Export settings">
    <button type="button" onClick={props.onToggle} aria-expanded={props.open} aria-controls="export-settings"
      className="w-full px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 text-left hover:bg-paper/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent">
      <span className="h-10 w-10 rounded-xl bg-paper text-accent flex items-center justify-center shrink-0"><FontAwesomeIcon icon={faSliders} /></span>
      <span className="flex-1 min-w-0"><span className="block text-sm font-semibold text-ink">Export settings</span><span className="block text-xs text-ink/60 mt-1">{summary}{props.publish && props.publishTarget && props.mode === "current" && !isImage ? " · Publish to website" : " · Ready to download"}</span></span>
      <span className="hidden sm:block text-xs text-ink/55">{props.open ? "Close settings" : "Customize download"}</span>
      <FontAwesomeIcon icon={faChevronDown} className={`text-xs text-ink/50 transition-transform ${props.open ? "rotate-180" : ""}`} />
    </button>
    <div id="export-settings" hidden={!props.open}>
      <div className="border-t border-line grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="p-4 sm:p-6 lg:border-r border-line min-w-0">
          <h3 className="text-sm font-semibold text-ink">{props.isBanner ? "File format" : "Documents to include"}</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">{props.isBanner ? "Choose the right format for your banner." : "Download this document or pair it with another."}</p>
          <fieldset className="grid sm:grid-cols-2 gap-3">
            <legend className="sr-only">{props.isBanner ? "File format" : "Documents to include"}</legend>
            {(props.isBanner ? [
              { value: "image", title: "PNG image", description: "Crisp text, ready for LinkedIn", icon: faFileImage },
              { value: "pdf", title: "PDF document", description: "Easy to share or print", icon: faFilePdf },
            ] : [
              { value: "current", title: "This document", description: "Export the document you’re editing", icon: faFilePdf },
              { value: "both", title: "Combine two", description: "Put both documents in one PDF", icon: faFilePdf },
            ]).map((option) => {
              const selected = (props.isBanner ? props.format : props.mode) === option.value;
              return <label key={option.value} className={`relative cursor-pointer rounded-xl border p-4 transition-colors min-w-0 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${selected ? "border-accent bg-accent/5" : "border-line hover:bg-paper/40"}`}>
                <span className="flex items-center justify-between gap-3 mb-3"><FontAwesomeIcon icon={option.icon} className={selected ? "text-accent" : "text-ink/40"} />
                  <input type="radio" name="export-selection" value={option.value} checked={selected} className="h-4 w-4 accent-accent"
                    onChange={() => { if (props.isBanner) props.onFormatChange(option.value as "pdf" | "image"); else props.onModeChange(option.value as "current" | "both"); }} />
                </span>
                <span className="block text-sm font-medium text-ink">{option.title}</span><span className="block text-xs text-ink/60 leading-relaxed mt-1">{option.description}</span>
              </label>;
            })}
          </fieldset>
          {!props.isBanner && props.mode === "both" && <div className="mt-4">
            <label htmlFor="exportOther" className="block text-xs font-medium text-ink/70 mb-2">Add after this document</label>
            <select id="exportOther" value={props.otherDoc} onChange={(event) => props.onOtherDocChange(event.target.value)} className="form-input w-full min-h-11 text-base">
              {props.otherDocs.map((doc) => <option key={doc.filename} value={doc.filename}>{doc.label}</option>)}
            </select>
          </div>}
        </div>
        <div className="p-4 sm:p-6 border-t lg:border-t-0 border-line min-w-0">
          <h3 className="text-sm font-semibold text-ink">{props.isBanner ? "Made for sharing" : "PDF preferences"}</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">{props.isBanner ? "Your banner, in the format you need." : "Fine-tune your file before downloading."}</p>
          {props.isBanner ? <div className="rounded-xl bg-paper/60 p-5 text-sm text-ink/70 leading-relaxed">
            <FontAwesomeIcon icon={isImage ? faFileImage : faFilePdf} className="text-accent mb-3 text-lg" />
            <p className="font-medium text-ink mb-1">{isImage ? "A sharp image for your profile" : "A portable copy of your banner"}</p>
            <p>{isImage ? "PNG keeps lettering, logos, and flat colors sharp. Use this version when uploading to LinkedIn." : "PDF preserves your banner layout for sharing and printing."}</p>
          </div> : <div className="space-y-3">
            <Option title="Smaller file" description="Compress photos to reduce file size. Images may look slightly softer." checked={props.compress} onChange={props.onCompressChange} />
            <Option title="PDF opening message" description="Include your configured message when opened in a supported PDF reader." checked={props.pdfAlert} onChange={props.onPdfAlertChange} />
          </div>}
        </div>
      </div>
      {!props.isBanner && props.mode === "current" && props.publishTarget && <div className="mx-4 sm:mx-6 mb-5 rounded-xl bg-accent/5 border border-accent/20 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <FontAwesomeIcon icon={faCloudArrowUp} className="text-accent mt-1 shrink-0" />
          <span className="flex-1 min-w-0"><span className="block text-sm font-medium text-ink">Update the website download</span><span className="block text-xs text-ink/65 leading-relaxed mt-1">Also replace the resume visitors download from your portfolio. You’ll confirm before publishing.</span><span className="block text-xs text-accent mt-2 break-all">{props.publishTarget}</span></span>
          <input type="checkbox" checked={props.publish} onChange={(event) => props.onPublishChange(event.target.checked)} className="mt-0.5 h-5 w-5 accent-accent shrink-0" />
        </label>
      </div>}
      <div className="border-t border-line bg-paper/30 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className={`text-xs leading-relaxed ${props.dirty ? "text-amber-800" : "text-ink/60"}`}>{props.dirty ? "Your download includes unsaved edits. Save to keep them for later." : "Your saved document is ready to download."}</p>
        <button type="button" onClick={props.onExport} disabled={props.exporting} className="btn-primary min-h-11 w-full sm:w-auto justify-center shrink-0 disabled:opacity-60"><FontAwesomeIcon icon={isImage ? faFileImage : faFilePdf} />{props.exporting ? "Preparing…" : isImage ? "Download PNG" : "Download PDF"}</button>
      </div>
    </div>
  </section>;
}
