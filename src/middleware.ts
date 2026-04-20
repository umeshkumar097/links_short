import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'localhost:3000';
  const authToken = req.cookies.get('auth-token')?.value;

  // Normalize hostname
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  let subdomain = '';
  
  if (hostname.includes(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  } else if (hostname !== rootDomain && !hostname.includes('.')) {
    subdomain = hostname;
  }

  // Allow Auth and Static routes
  if (url.pathname.startsWith('/api/auth') || url.pathname === '/login') {
    return NextResponse.next();
  }

  // 1. Master Admin Rewrite & Protect
  if (subdomain === 'app') {
    if (!authToken || authToken !== 'admin-session') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.rewrite(new URL(`/admin${url.pathname}${url.search}`, req.url));
  }

  // 2. Client Rewrite & Protect
  if (subdomain && subdomain !== '') {
    // Check if it's a short link redirection (usually path is /[slug])
    // Short links should NOT be password protected unless specifically requested.
    // Dashboard (path "/") SHOULD be protected.
    if (url.pathname === '/') {
      if (!authToken || !authToken.startsWith('tenant-')) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    return NextResponse.rewrite(new URL(`/clients/${subdomain}${url.pathname}${url.search}`, req.url));
  }

  // 3. Root Domain
  return NextResponse.next();
}
