"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCubes, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const STORAGE_KEY = "modalLastShown";
const SIX_HOURS = 6 * 60 * 60 * 1000;

export default function HostingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (!lastShown || now - parseInt(lastShown, 10) > SIX_HOURS) {
        setOpen(true);
      }
    } catch {
      // localStorage unavailable; skip the modal
    }
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hostingModalLabel"
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-line">
        <div className="bg-paper border-b border-line px-6 py-4 flex items-center justify-between">
          <h5 className="font-serif text-ink text-base" id="hostingModalLabel">
            Powered by Modern Infrastructure
          </h5>
          <button onClick={close} className="text-ink/50 hover:text-ink transition-colors" aria-label="Close">
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>
        <div className="px-6 py-5 text-ink/70 text-sm">
          <p className="mb-4">This website is built, deployed, and maintained by Brandon Sanders.</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faCubes} className="text-accent mt-0.5 w-4 shrink-0" aria-hidden="true" />
              <span>
                Runs as a <strong className="text-ink">Kubernetes container</strong> on my home cluster for reliability and fast updates.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="text-accent mt-0.5 w-4 shrink-0" aria-hidden="true" />
              <span>
                Traffic is routed through <strong className="text-ink">Cloudflare</strong> for secure delivery, caching, and edge protection.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faGithub} className="text-accent mt-0.5 w-4 shrink-0" aria-hidden="true" />
              <span>The full source is publicly available on GitHub.</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <a href="https://github.com/brandonsanders48/ResumePortfolio" target="_blank" rel="noopener" className="btn-outline">
              <FontAwesomeIcon icon={faGithub} /> View Project on GitHub
            </a>
          </div>
          <Image
            src="/files/images/cloudflare.png"
            alt="Kubernetes and Cloudflare"
            width={96}
            height={40}
            className="w-24 mx-auto mt-4 block opacity-70"
          />
        </div>
        <div className="px-6 py-4 border-t border-line flex justify-end">
          <button onClick={close} className="btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
