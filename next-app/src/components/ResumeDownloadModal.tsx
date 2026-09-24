"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFileArrowDown, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";

export default function ResumeDownloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "downloading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setErrorMsg("");
    fetch("/api/turnstile-config")
      .then((res) => res.json())
      .then((data) => setSiteKey(data.siteKey))
      .catch(() => {});
  }, [open]);

  async function handleVerify(token: string) {
    setStatus("downloading");
    try {
      const res = await fetch("/api/resume-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setErrorMsg(json?.message || "Download failed. Please try again.");
        setStatus("error");
        turnstileRef.current?.reset();
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Brandon-Sanders-Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch {
      setErrorMsg("Unexpected error. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="resumeDownloadLabel" className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-line">
        <div className="bg-paper border-b border-line px-6 py-4 flex items-center justify-between">
          <h5 className="font-serif text-ink text-base" id="resumeDownloadLabel">
            Quick verification
          </h5>
          <button onClick={onClose} className="text-ink/65 hover:text-ink transition-colors" aria-label="Close">
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>
        <div className="px-6 py-6 text-center">
          {status === "done" ? (
            <div className="text-sm text-ink/70">
              <FontAwesomeIcon icon={faFileArrowDown} className="text-2xl text-accent mb-2" />
              <p>Your download should start automatically.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink/60 mb-4">One quick check to keep the bots out, then your download starts automatically.</p>
              <div className="flex justify-center">
                <Turnstile ref={turnstileRef} siteKey={siteKey} onVerify={handleVerify} />
              </div>
              {status === "downloading" && <p className="text-xs text-ink/65 mt-3">Preparing your download…</p>}
              {status === "error" && (
                <p className="text-xs text-red-600 mt-3 flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon icon={faCircleExclamation} /> {errorMsg}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
