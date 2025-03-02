import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const encryptedToken = request.cookies.get("token")|| "";
    //TODO VALIDATION OF TOKEN
    if(!encryptedToken) return NextResponse.redirect(new URL('/login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/game',
}