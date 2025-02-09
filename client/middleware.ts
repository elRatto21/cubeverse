// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.endsWith(".css")
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isPublicPath =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (isPublicPath && !token) {
    return NextResponse.next();
  }

  if (!token && !isPublicPath) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (
    token &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.css$).*)"],
};
