// Structured logging for security-relevant events (failed logins, rate-limit
// hits, etc). Writes JSON lines to stdout/stderr so they show up in
// container logs without needing a separate logging service.

export function logSecurityEvent(event: string, details: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ securityEvent: event, time: new Date().toISOString(), ...details }));
}

export function logSecurityInfo(event: string, details: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ securityEvent: event, time: new Date().toISOString(), ...details }));
}
