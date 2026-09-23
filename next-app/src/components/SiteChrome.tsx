"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HostingModal from "@/components/HostingModal";
import ClarityAnalytics from "@/components/ClarityAnalytics";

// The gate page is a standalone full-screen verification step, not a real
// page of the site, so it skips the nav/footer/modal/analytics chrome
// every other route gets.
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/gate");

  if (bare) {
    return (
      <main id="content" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main id="content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <HostingModal />
      <ClarityAnalytics />
    </>
  );
}
