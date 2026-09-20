"use client";

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

const Turnstile = forwardRef<
  TurnstileHandle,
  {
    siteKey: string | null;
    onVerify: (token: string) => void;
    onExpire?: () => void;
  }
>(function Turnstile({ siteKey, onVerify, onExpire }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const id = useId();

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.turnstile) return;
    const el = containerRef.current;
    const widgetId = window.turnstile.render(el, {
      sitekey: siteKey,
      callback: (token: string) => onVerify(token),
      "expired-callback": () => onExpire?.(),
    });
    widgetIdRef.current = widgetId;
    return () => {
      if (window.turnstile && widgetId) window.turnstile.remove(widgetId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} id={`turnstile-${id}`} />
    </>
  );
});

export default Turnstile;
