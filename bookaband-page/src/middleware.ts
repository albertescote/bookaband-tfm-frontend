import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { cookieName, fallbackLng, languages } from './app/i18n/settings';
import { AUTH_URL } from '@/publicConfig';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

const publicRoutes = [
  '/',
  '/contact',
  '/about',
  '/how-it-works',
  '/faqs',
  '/find-artists',
];

const publicRoutePrefixes = ['/artists/'];

const createResponse = () => {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
};

const createRedirectResponse = (url: string, req: NextRequest) => {
  const response = NextResponse.redirect(new URL(url, req.url));
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
};

export async function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  const pathname = req.nextUrl.pathname.replace(/\/+/g, '/');
  if (pathname !== req.nextUrl.pathname) {
    return createRedirectResponse(pathname, req);
  }

  if (
    !languages.some((loc) => {
      const langPrefix = `/${loc}`;
      return pathname === langPrefix || pathname.startsWith(`${langPrefix}/`);
    }) &&
    !pathname.startsWith('/_next')
  ) {
    return createRedirectResponse(
      `/${lng}${pathname}${req.nextUrl.search}`,
      req,
    );
  }

  const detectedLngFromPath = languages.find((l) =>
    pathname.startsWith(`/${l}`),
  );

  if (detectedLngFromPath) {
    const response = createResponse();
    response.cookies.set(cookieName, detectedLngFromPath);

    const normalizedPathParts = pathname.split('/').slice(2);
    const normalizedPath =
      normalizedPathParts.length > 0
        ? '/' + normalizedPathParts.join('/')
        : '/';

    const isPublic =
      publicRoutes.some(
        (route) =>
          normalizedPath === route || normalizedPath.startsWith(`${route}/`),
      ) ||
      publicRoutePrefixes.some((prefix) => normalizedPath.startsWith(prefix));

    const authCookie = req.cookies.get('access_token')?.value;

    if (!isPublic && !authCookie) {
      return createRedirectResponse(
        `${AUTH_URL}/${detectedLngFromPath}/login`,
        req,
      );
    }

    return response;
  }

  return createResponse();
}
