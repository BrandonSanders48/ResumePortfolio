"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function ClarityAnalytics() {
  const pathname = usePathname();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/editor")) return;
    fetch("/api/clarity-id")
      .then((res) => res.json())
      .then((data) => setProjectId(data.projectId))
      .catch(() => {});
  }, [pathname]);

  if (!projectId || pathname?.startsWith("/editor")) return null;

  return (
    <Script id="clarity-tracking" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${projectId}");`}
    </Script>
  );
}
