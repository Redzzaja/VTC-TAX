import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ambil cookie sesi user
  const session = request.cookies.get("user_session");

  // Cek halaman yang sedang diakses
  const { pathname } = request.nextUrl;

  // ATURAN 1: Jika user belum login tapi mau masuk Dashboard -> Tendang ke Login
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ATURAN 2: Jika user SUDAH login tapi mau masuk halaman Login -> Arahkan ke Dashboard
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga oleh Middleware
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (file statis)
     * 4. favicon.ico, sitemap.xml (file publik)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
