import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/account/orders", "/account/addresses", "/account/settings"];

function isProtectedPath(pathname: string): boolean {
  if (pathname === "/account") return true;
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (isProtectedPath(nextUrl.pathname) && !isLoggedIn) {
    const url = new URL("/auth/login", nextUrl);
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return Response.redirect(url);
  }

  if (
    isLoggedIn &&
    (nextUrl.pathname === "/auth/login" || nextUrl.pathname === "/auth/register")
  ) {
    return Response.redirect(new URL("/account", nextUrl));
  }
});

export const config = {
  matcher: ["/account/:path*", "/auth/:path*"],
};
