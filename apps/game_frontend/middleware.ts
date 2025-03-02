import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const encryptedToken = request.cookies.get("token")?.value || "";
    const redirectedResponse = NextResponse.redirect(
      new URL("/login", request.url)
    );
    redirectedResponse.headers.set("x-middleware-cache", "no-cache");
    if (!encryptedToken) return redirectedResponse;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/game',
}