import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Next.js 16 renamed `middleware.ts` to `proxy.ts`. This runs a fast,
// optimistic check for a session cookie only (no DB call) so unauthenticated
// visitors are redirected before rendering. The real, verified session check
// still happens in app/admin/layout.tsx via auth.api.getSession.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
