import { NextFetchEvent, NextRequest } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/admin/login"]);
const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

const authMiddleware = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/admin");
  }
  if (isProtectedRoute(request) && !isSignInPage(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/admin/login");
  }
});

// Behind the hosting provider's reverse proxy the browser talks https but this
// app is handed plain http, so Convex Auth's same-origin check (Origin vs the
// request's own protocol) rejects every sign-in POST with "Invalid origin".
// When the Origin's host matches the site's public host, treat the request as
// same-origin by aligning the protocol; a genuinely different host still fails.
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const origin = request.headers.get("origin");
  if (origin) {
    const publicHost = (
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      ""
    )
      .split(",")[0]
      .trim();
    try {
      const originUrl = new URL(origin);
      if (publicHost && originUrl.host === publicHost && originUrl.protocol !== request.nextUrl.protocol) {
        const url = new URL(request.url);
        url.protocol = originUrl.protocol;
        url.host = publicHost;
        const aligned = new NextRequest(url, request);
        aligned.headers.set("host", publicHost);
        return authMiddleware(aligned, event);
      }
    } catch {
      // malformed Origin header — fall through and let the auth check reject it
    }
  }
  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
