import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { cookieName, fallbackLng, languages } from './app/i18n/settings';
import { validateAccessToken } from '@/service/auth';
import { Role } from '@/service/backend/domain/role';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

const protectedRoutes: string[] = [
  '/offer-details',
  '/profile',
  '/chat',
  '/chat/[id]',
];
const clientProtectedRoutes: string[] = ['/chat/new'];
const musicianProtectedRoutes: string[] = ['/manage-offers', '/band', '/offer'];

export async function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
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

  const allProtectedRoutes = protectedRoutes.concat(
    protectedRoutes,
    clientProtectedRoutes,
    musicianProtectedRoutes,
  );

  const langPrefix = `/${lng}`;

  const protectedRouteFound = allProtectedRoutes.find((route) => {
    return new RegExp(
      `^${langPrefix}${route.replace(/\[.*\]/, '[^/]+')}$`,
    ).test(req.nextUrl.pathname);
  });
  const isProtectedRoute = !!protectedRouteFound;

  if (isProtectedRoute) {
    let authorized = false;
    let role: string | undefined = '';
    const accessTokenPayload = await validateAccessToken();
    if (accessTokenPayload) {
      role = accessTokenPayload.role;
      if (
        role === Role.Musician &&
        clientProtectedRoutes.includes(protectedRouteFound)
      ) {
        return NextResponse.redirect(new URL(`/${lng}/forbidden`, req.nextUrl));
      } else if (
        role === Role.Client &&
        musicianProtectedRoutes.includes(protectedRouteFound)
      ) {
        return NextResponse.redirect(new URL(`/${lng}/forbidden`, req.nextUrl));
      } else {
        authorized = true;
      }
    }
    if (!authorized) {
      const redirectUrl = encodeURIComponent(
        protectedRouteFound?.split('/')[1] + req.nextUrl.search,
      );
      return NextResponse.redirect(
        new URL(`/${lng}/login?redirect_to=${redirectUrl}`, req.nextUrl),
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
