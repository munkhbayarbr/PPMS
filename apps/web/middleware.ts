// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/register",      // ⬅️ register-ээ нэмж public болгосон
  "/api/auth",      // NextAuth callback/authorize
  "/_next",         // Next.js assets
];

const STATIC_FILE_EXT =
  /\.(?:png|jpg|jpeg|webp|gif|svg|ico|bmp|avif|mp4|webm|ogg|mp3|wav|txt|xml|json|pdf|woff2?|ttf|otf|eot)$/i;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Static/Next/Auth замуудыг бүрэн нэвтрүүлнэ
  if (
    pathname === "/favicon.ico" ||
    STATIC_FILE_EXT.test(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // 2) JWT асаалттай эсэх
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // эхлээд орж ирэх гэсэн URL-аа хадгалъя
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Файл өргөтгөлтэй URL-ууд, _next, api, favicon-ыг middleware-ээс хасна
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*$).*)"],
};
