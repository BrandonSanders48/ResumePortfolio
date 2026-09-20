"use client";

import dynamic from "next/dynamic";
import type { EditorDoc } from "@/lib/editor-docs";

// The editor is fully interactive (live-measured preview dimensions,
// relative "saved Xs ago" timestamps) and sits behind an auth wall, so there
// is nothing to gain from server-rendering it and real risk of hydration
// mismatches between the server's render pass and the client's. Load it
// client-only instead.
const EditorApp = dynamic(() => import("./EditorApp"), {
  ssr: false,
  loading: () => (
    <div className="bg-paper min-h-[80vh] py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="h-40 rounded-2xl border border-line bg-white animate-pulse" />
      </div>
    </div>
  ),
});

export default function EditorAppLoader(props: {
  docs: EditorDoc[];
  initialDoc: string;
  initialContent: string;
  contactPhone?: string;
  contactPhoneTel?: string;
  contactEmail?: string;
}) {
  return <EditorApp {...props} />;
}
