"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";

type Status = { type: "success" | "error"; message: string } | null;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>(null);
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
      setStatus({ type: "error", message: "Please complete the verification check before sending." });
      return;
    }

    setSending(true);
    setStatus(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("bs_name"),
      email: data.get("bs_email"),
      company: data.get("bs_company"),
      message: data.get("bs_message"),
      turnstileToken: token,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setStatus({ type: json.success ? "success" : "error", message: json.message });
      if (json.success) form.reset();
    } catch {
      setStatus({ type: "error", message: "Unexpected error. Please try again." });
    } finally {
      setSending(false);
      setToken("");
      turnstileRef.current?.reset();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-line p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0" aria-hidden="true">
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
        <div>
          <div className="font-semibold text-ink text-[0.95rem]">Send a message</div>
          <div className="text-ink/65 text-xs">Short and simple is perfect.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {status && (
          <div
            className={`block px-4 py-3 rounded-lg text-sm font-medium ${
              status.type === "success" ? "bg-accent/10 border border-accent/30 text-ink" : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bs_name" className="block text-sm font-medium text-ink/70 mb-1.5">
              Name
            </label>
            <input type="text" id="bs_name" name="bs_name" className="form-input" placeholder="Your name" autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="bs_email" className="block text-sm font-medium text-ink/70 mb-1.5">
              Email
            </label>
            <input type="email" id="bs_email" name="bs_email" className="form-input" placeholder="your@email.com" autoComplete="email" required />
          </div>
        </div>

        <div>
          <label htmlFor="bs_company" className="block text-sm font-medium text-ink/70 mb-1.5">
            Company
          </label>
          <input type="text" id="bs_company" name="bs_company" className="form-input" placeholder="Organization" autoComplete="organization" required />
        </div>

        <div>
          <label htmlFor="bs_message" className="block text-sm font-medium text-ink/70 mb-1.5">
            Message
          </label>
          <textarea id="bs_message" name="bs_message" maxLength={500} className="form-input" placeholder="Your message…" required />
        </div>

        {siteKey && (
          <div className="flex justify-center">
            <Turnstile ref={turnstileRef} siteKey={siteKey} onVerify={setToken} onExpire={() => setToken("")} />
          </div>
        )}

        <button type="submit" disabled={sending} className="btn-primary justify-center w-full py-3 disabled:opacity-60">
          {sending ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
