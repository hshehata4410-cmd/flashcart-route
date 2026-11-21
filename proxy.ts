import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@features/auth/utils/session";

/** Signed-in users are sent home instead of seeing these. */
const GUEST_ONLY_ROUTES = ["/login", "/register"];

/** Guests are sent to the login page. */
const PROTECTED_ROUTES = ["/profile", "/checkout"];

const matches = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  if (isAuthenticated && matches(pathname, GUEST_ONLY_ROUTES)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && matches(pathname, PROTECTED_ROUTES)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Skip Next.js internals and static assets so only page requests are checked.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
