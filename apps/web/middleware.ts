import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
	const token = await getToken({
		req: req as any,
		secret: process.env.NEXTAUTH_SECRET,
	})

	const PUBLIC_PATHS = [
		'/login',
		'/signup',
		'/svgs/',
		'/favicon.ico',
		'/api/auth',
		'/_next',
		'/images',
		'/fonts',
		'/core',
	]

	if (PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
		return NextResponse.next()
	}

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	return NextResponse.next()
}
export const config = {
	matcher: ['/', '/((?!api|_next|favicon.ico).*)'],
}
