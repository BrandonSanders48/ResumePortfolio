"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { navLinks } from "@/lib/nav-links";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link
              href="/"
              title="Back to portfolio"
              aria-label="Back to portfolio"
              className="mr-1 text-ink/50 hover:text-ink transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
            <Image
              src="/files/images/bs-logo.svg"
              alt="BS"
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-md object-cover"
            />
            <span className="text-ink font-semibold text-sm tracking-tight">Brandon Sanders</span>
          </Link>
        </div>

        <ul className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-ink/60 hover:text-ink text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-ink/70 hover:text-ink p-2 -mr-2 rounded-lg hover:bg-paper transition-all"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} className="text-lg" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-line px-4 pb-4">
          <ul className="flex flex-col gap-0.5 pt-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-ink/70 hover:text-ink text-sm font-medium px-1 py-2.5 border-b border-line/70 last:border-none transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
