import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const TOKEN_NAME = 'session_token';

const RUTAS_PUBLICAS = ['/', '/login', '/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_NAME)?.value;

  const esRutaViaje = pathname.startsWith('/dashboard/viajes/');
  const esAuthPublica = pathname === '/login' || pathname === '/registro';

  if (esRutaViaje && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (esAuthPublica && token) {
    return NextResponse.redirect(new URL('/dashboard/cuenta', request.url));
  }

  if (
    pathname.startsWith('/dashboard') &&
    !RUTAS_PUBLICAS.includes(pathname) &&
    !esRutaViaje &&
    !token
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registro'],
};
