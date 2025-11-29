import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./app/lib/jwt";


export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("auth-token")?.value;

  const payload = token ? await verifyTokenEdge(token) : null;

  if (!payload || payload.role !== "CAPTAIN") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blogs/create/:path*",
    "/blog/:path*",
    "/defi/:path*",
  ],
};
