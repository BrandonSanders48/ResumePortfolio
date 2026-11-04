type Target = { jobName: string; companyName: string };
type AiResponse = {
  question?: string;
  content?: string;
  edits: { before: string; after: string }[];
  target?: Target | null;
};

/** Proxies and access gateways can return HTML even for a JSON API request. */
export async function readEditorAiResponse(response: Response): Promise<AiResponse> {
  const reference = response.headers.get("cf-ray");
  const detail = ` (HTTP ${response.status}${reference ? `; reference ${reference}` : ""})`;
  if (response.redirected) throw new Error("The AI request was redirected. Reload the editor and sign in again." + detail);
  let result;
  try { result = JSON.parse(await response.text()); } catch {
    if (response.headers.get("cf-mitigated") === "challenge") {
      throw new Error("The site's security check interrupted the AI request. Reload the editor and try again." + detail);
    }
    if (response.status === 401) throw new Error("Your session expired. Reload the editor and sign in again." + detail);
    if (response.status === 403) throw new Error("The server or security gateway blocked the AI request." + detail);
    if (response.status === 404) throw new Error("The AI endpoint is unavailable. Reload the editor; the deployment may still be updating." + detail);
    if (response.status === 413) throw new Error("The document is too large for the server's request limit." + detail);
    if ([408, 504, 524].includes(response.status)) throw new Error("The AI request timed out. Try a smaller change." + detail);
    if (response.status >= 500) throw new Error("The server or proxy could not complete the AI request. Please try again shortly." + detail);
    throw new Error("The server returned a webpage instead of an AI response. Reload the editor and try again." + detail);
  }
  if (!response.ok) {
    throw new Error(typeof result?.message === "string" ? result.message : "AI editing failed." + detail);
  }
  if (!result || typeof result !== "object") throw new Error("The AI returned an invalid response. Please try again.");
  if (typeof result.question === "string" && result.question.trim()) return { question: result.question, edits: [] };
  if (typeof result.content !== "string" || !Array.isArray(result.edits) ||
      !result.edits.every((edit: unknown) => edit && typeof edit === "object" && "before" in edit && "after" in edit &&
        typeof edit.before === "string" && typeof edit.after === "string") ||
      (result.target != null && (typeof result.target.jobName !== "string" || typeof result.target.companyName !== "string"))) {
    throw new Error("The AI returned incomplete changes. Please try again.");
  }
  return { content: result.content, edits: result.edits, target: result.target ?? null };
}
