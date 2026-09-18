import { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/editor-auth";

export function isAuthorized(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}
