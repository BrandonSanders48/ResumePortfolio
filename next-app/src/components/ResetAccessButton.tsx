"use client";

import { useEffect, useState } from "react";

export default function ResetAccessButton() {
  // Fetched client-side rather than read from process.env in the (statically
  // prerendered) Footer: a direct env read there would get baked in at build
  // time, when SITE_GATE_ENABLED isn't set, and would then never reflect the
  // real runtime value -- same class of bug as the Clarity analytics one.
  const [gateEnabled, setGateEnabled] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/turnstile-config")
      .then((res) => res.json())
      .then((data) => setGateEnabled(Boolean(data.gateEnabled)))
      .catch(() => {});
  }, []);

  async function handleReset() {
    setResetting(true);
    try {
      await fetch("/api/site-verify", { method: "DELETE" });
    } finally {
      window.location.href = "/";
    }
  }

  if (!gateEnabled) return null;

  return (
    <>
      <span className="mx-1.5 text-white/30">&middot;</span>
      <button
        onClick={handleReset}
        disabled={resetting}
        className="hover:text-white/85 transition-colors disabled:opacity-60"
        title="Clear the site verification cookie and go back through the gate"
      >
        {resetting ? "Resetting…" : "Reset access"}
      </button>
    </>
  );
}
