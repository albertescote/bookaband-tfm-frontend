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

function getFullRedirectPath(
  routePattern: string,
  actualPath: string,
  langPrefix: string,
  searchParams: string,
): string {
  let pathPart = actualPath.replace(langPrefix, '');
  if (routePattern.includes('[')) {
    const paramNames: string[] = [];
    const matches = routePattern.matchAll(/\[([^\]]+)\]/g);
    for (const match of matches) {
      paramNames.push(match[1]);
    }

    const regexPattern = routePattern
      .replace(/\[[^\]]+\]/g, '([^/]+)')
      .replace(/\//g, '\\/');

    const match = new RegExp(`^${regexPattern}$`).exec(actualPath);

    if (match) {
      let result = routePattern;
      paramNames.forEach((param, index) => {
        result = result.replace(`[${param}]`, match[index + 1]);
      });
      pathPart = result.replace(langPrefix, '');
    }
  }

  return searchParams ? `${pathPart}?${searchParams}` : pathPart;
}

export async function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Path normalization
  const pathname = req.nextUrl.pathname.replace(/\/+/g, '/');
  if (pathname !== req.nextUrl.pathname) {
    return createRedirectResponse(pathname, req);
  }

  // Language prefix redirection
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

  const langPrefix = `/${lng}`;
  const allProtectedRoutes = [
    ...COMMON_PROTECTED_ROUTES,
    ...CLIENT_PROTECTED_ROUTES,
    ...MUSICIAN_PROTECTED_ROUTES,
  ];

  const protectedRouteFound = allProtectedRoutes.find((route) => {
    const normalizedRoute = route.replace(/\[.*?\]/, '[^/]+');
    return new RegExp(`^${langPrefix}${normalizedRoute}$`).test(pathname);
  });

  const isProtectedRoute = !!protectedRouteFound;

  // Handle protected routes
  if (isProtectedRoute) {
    const accessTokenPayload = await validateAccessTokenSignature();

    if (!accessTokenPayload) {
      const redirectPath = getFullRedirectPath(
        protectedRouteFound,
        pathname,
        langPrefix,
        req.nextUrl.searchParams.toString(),
      );

      if (!redirectPath.startsWith('/login')) {
        return createRedirectResponse(`/${lng}/login`, req);
      }
      return createResponse();
    }

    // Role-based authorization
    const { role } = accessTokenPayload;
    if (
      (role === Role.Musician &&
        CLIENT_PROTECTED_ROUTES.includes(protectedRouteFound)) ||
      (role === Role.Client &&
        MUSICIAN_PROTECTED_ROUTES.includes(protectedRouteFound))
    ) {
      return createRedirectResponse(`/${lng}/forbidden`, req);
    }
  }

  const detectedLngFromPath = languages.find((l) =>
    pathname.startsWith(`/${l}`),
  );
  if (detectedLngFromPath) {
    const response = createResponse();
    response.cookies.set(cookieName, detectedLngFromPath);
    return response;
  }

  return createResponse();
}
