import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("user_session");
  const { pathname } = request.nextUrl;

  // 1. Lindungi Dashboard (Tidak ada perubahan)
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Redirect jika User Sudah Login
  // Tambahkan '|| pathname === "/register"' agar user login tidak bisa daftar lagi
  if ((pathname === "/" || pathname === "/register") && session) {
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
