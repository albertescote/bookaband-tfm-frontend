import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { cookieName, fallbackLng, languages } from './app/i18n/settings';
import { validateAccessTokenSignature } from '@/service/backend/auth/service/auth.service';
import { Role } from '@/service/backend/user/domain/role';
import {
  CLIENT_PROTECTED_ROUTES,
  COMMON_PROTECTED_ROUTES,
  MUSICIAN_PROTECTED_ROUTES,
} from '@/config';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export async function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  if (
    !languages.some((loc) => {
      const langPrefix = `/${loc}`;
      const { pathname } = req.nextUrl;
      return pathname === langPrefix || pathname.startsWith(`${langPrefix}/`);
    }) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname + req.nextUrl.search}`, req.url),
    );
  }

  let allProtectedRoutes: string[] = [];
  allProtectedRoutes = allProtectedRoutes.concat(
    COMMON_PROTECTED_ROUTES,
    CLIENT_PROTECTED_ROUTES,
    MUSICIAN_PROTECTED_ROUTES,
  );

  const langPrefix = `/${lng}`;

  const pathname = req.nextUrl.pathname.replace(/\/+/g, '/');
  if (pathname !== req.nextUrl.pathname) {
    return NextResponse.redirect(new URL(pathname, req.url));
  }

  const protectedRouteFound = allProtectedRoutes.find((route) => {
    const normalizedRoute = route.replace(/\[.*?\]/, '[^/]+');
    return new RegExp(`^${langPrefix}${normalizedRoute}$`).test(pathname);
  });
  const isProtectedRoute = !!protectedRouteFound;

  if (isProtectedRoute) {
    let authorized = false;
    let role: string | undefined = '';
    const accessTokenPayload = await validateAccessTokenSignature();
    if (accessTokenPayload) {
      role = accessTokenPayload.role;
      if (
        role === Role.Musician &&
        CLIENT_PROTECTED_ROUTES.includes(protectedRouteFound)
      ) {
        return NextResponse.redirect(new URL(`/${lng}/forbidden`, req.nextUrl));
      } else if (
        role === Role.Client &&
        MUSICIAN_PROTECTED_ROUTES.includes(protectedRouteFound)
      ) {
        return NextResponse.redirect(new URL(`/${lng}/forbidden`, req.nextUrl));
      } else {
        authorized = true;
      }
    }
    if (!authorized) {
      const redirectPath = protectedRouteFound?.replace(langPrefix, '') || '';
      if (redirectPath.startsWith('/login')) {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL(
          `/${lng}/login?redirect_to=${encodeURIComponent(redirectPath)}`,
          req.url,
        ),
      );
    }
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
