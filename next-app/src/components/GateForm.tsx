"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";
import HeroBackground from "@/components/HeroBackground";

export default function GateForm({ next }: { next: string }) {
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    fetch("/api/turnstile-config")
      .then((res) => res.json())
      .then((data) => setSiteKey(data.siteKey))
      .catch(() => {});
  }, []);

  async function handleVerify(token: string) {
    setStatus("verifying");
    setErrorMsg("");
    try {
      const res = await fetch("/api/site-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setErrorMsg(json?.message || "Verification failed. Please try again.");
        setStatus("error");
        turnstileRef.current?.reset();
        return;
      }
      window.location.href = next;
    } catch {
      setErrorMsg("Unexpected error. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-paper px-4">
      <HeroBackground />
      <div className="w-full max-w-sm text-center relative bg-white rounded-2xl border border-line shadow-sm p-8">
        <Image
          src="/files/images/Brandon_Sanders-cropped.png"
          alt="Brandon Sanders"
          width={112}
          height={112}
          priority
          className="w-28 h-28 rounded-2xl object-cover border border-line shadow-sm mx-auto mb-5"
        />
        <h1 className="font-serif text-2xl text-ink mb-1.5">Brandon Sanders, CISSP</h1>
        <p className="text-ink/60 text-sm mb-1">IT Security Leader &amp; Manager &middot; Portfolio &amp; Resume</p>
        <p className="text-ink/40 text-xs mb-6">One quick check before you continue.</p>

        <div className="flex flex-col items-center pt-6 border-t border-line">
          <Turnstile ref={turnstileRef} siteKey={siteKey} onVerify={handleVerify} />
          {!siteKey && <p className="text-xs text-ink/40 mt-1">Loading verification…</p>}
          {status === "verifying" && <p className="text-xs text-ink/40 mt-3">Verifying…</p>}
          {status === "error" && (
            <p className="text-xs text-red-600 mt-3 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCircleExclamation} /> {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
