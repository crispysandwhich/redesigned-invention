import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./app/lib/jwt";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const token = req.cookies.get("auth-token")?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  // ---- AUTH CHECKS ----

  // 1️⃣ CAPTAIN ONLY ROUTES
  if (path.startsWith("/defi")) {
    if (!payload || payload.role !== "CAPTAIN") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // 2️⃣ CAPTAIN + USER ROUTES
  if (path.startsWith("/dashboard") || path.startsWith("/profile")) {
    if (!payload || (payload.role !== "CAPTAIN" && payload.role !== "USER")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // 3️⃣ EVERYTHING ELSE → ALWAYS ALLOW
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/defi/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};
