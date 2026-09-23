"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    fetch("/api/turnstile-config")
      .then((res) => res.json())
      .then((data) => setSiteKey(data.siteKey))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (siteKey && !token) {
      setError("Please complete the verification check before signing in.");
      return;
    }

    setSending(true);
    setError("");

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/editor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password"), turnstileToken: token }),
      });
      const json = await res.json();
      if (json.success) {
        router.refresh();
      } else {
        setError(json.message || "Invalid username or password.");
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSending(false);
      setToken("");
      turnstileRef.current?.reset();
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-line p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0" aria-hidden="true">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <div>
            <h1 className="font-serif text-xl text-ink">Resume Editor</h1>
            <div className="text-ink/45 text-xs">Login required</div>
          </div>
        </div>

        {!configured && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-amber-50 border border-amber-200 text-amber-900">
            Login is not configured. Set <strong>RESUME_EDITOR_USERNAME</strong>, <strong>RESUME_EDITOR_PASSWORD_HASH</strong>, and{" "}
            <strong>RESUME_EDITOR_SESSION_SECRET</strong>.
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-red-100 border border-red-300 text-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-ink/70 mb-1.5">
              Username
            </label>
            <input type="text" id="username" name="username" className="form-input" autoComplete="username" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink/70 mb-1.5">
              Password
            </label>
            <input type="password" id="password" name="password" className="form-input" autoComplete="current-password" required />
          </div>
          {siteKey && (
            <div className="flex justify-center">
              <Turnstile ref={turnstileRef} siteKey={siteKey} onVerify={setToken} onExpire={() => setToken("")} />
            </div>
          )}
          <button type="submit" disabled={sending} className="btn-primary justify-center w-full py-3 disabled:opacity-60">
            {sending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
