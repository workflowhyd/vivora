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

// Behind the hosting provider's reverse proxy the app sees an internal Host
// (e.g. 10.x.x.x:3000) while the browser's Origin is the public https site, so
// Convex Auth's same-origin check rejects every sign-in POST with "Invalid
// origin". When the Origin matches the proxy-reported public host
// (x-forwarded-host), align the request's Host and protocol to it. A browser
// on another site can't set that header cross-origin, so real CORS requests
// still fail.
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
      const hostMismatch = request.headers.get("host") !== publicHost;
      if (
        publicHost &&
        originUrl.host === publicHost &&
        (hostMismatch || originUrl.protocol !== request.nextUrl.protocol)
      ) {
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
  // Only the admin area and the auth proxy need the auth layer; public pages skip it.
  matcher: ["/admin/:path*", "/api/auth"],
};
