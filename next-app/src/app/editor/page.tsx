import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken, isLoginConfigured } from "@/lib/editor-auth";
import { listDocs, pickDefaultDoc, readDoc } from "@/lib/editor-docs";
import { getContactEmail, getContactPhone, getContactPhoneTel } from "@/lib/editor-tokens";
import LoginForm from "@/components/editor/LoginForm";
import EditorAppLoader from "@/components/editor/EditorAppLoader";

export const metadata: Metadata = {
  title: "Resume Editor",
  robots: { index: false, follow: false },
};

export default async function EditorPage() {
  const cookieStore = await cookies();
  const loggedIn = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!loggedIn) {
    return <LoginForm configured={isLoginConfigured()} />;
  }

  const docs = await listDocs();
  const activeDoc = pickDefaultDoc(docs);
  const content = await readDoc(activeDoc);

  return (
    <EditorAppLoader
      docs={docs}
      initialDoc={activeDoc}
      initialContent={content}
      contactPhone={getContactPhone()}
      contactPhoneTel={getContactPhoneTel()}
      contactEmail={getContactEmail()}
    />
  );
}
