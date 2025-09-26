import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = new Set<string>(["/login", "/signup"]);

const STATIC_FILE_EXT =
  /\.(?:png|jpg|jpeg|webp|gif|svg|ico|bmp|avif|mp4|webm|ogg|mp3|wav|txt|xml|json|pdf|woff2?|ttf|otf|eot)$/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") || // Next.js дотоод ассет
    pathname.startsWith("/api/auth") || // NextAuth callback/auth зам
    pathname === "/favicon.ico" || // favicon
    STATIC_FILE_EXT.test(pathname) // public root дахь бүх файлууд (жишээ нь /Logo.png)
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*$).*)"],
};
