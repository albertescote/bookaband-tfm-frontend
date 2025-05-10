import { cookies } from 'next/headers';
import { ParsedCookie } from '@/service/backend/auth/domain/parsedCookie';

export function setTokenCookie(
  parsedCookie: ParsedCookie,
  maxAge?: number,
): void {
  const cookieStore = cookies();
  cookieStore.set(parsedCookie.name, parsedCookie.value, {
    httpOnly: parsedCookie.options.httponly as boolean,
    sameSite: parsedCookie.options.samesite as 'strict' | 'lax' | 'none',
    secure: parsedCookie.options.secure as boolean,
    maxAge,
  });
}

export function getAccessTokenCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('access_token')?.value;
}

export function getRefreshTokenCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('refresh_token')?.value;
}

export function deleteAccessTokenCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('access_token');
}

export function deleteRefreshTokenCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('refresh_token');
}

export function parseCookie(cookie: string): ParsedCookie {
  const [keyValue, ...options] = cookie.split('; ');
  const [name, value] = keyValue.split('=');

  const cookieOptions: Record<string, string | boolean> = {};

  options.forEach((option) => {
    const [key, val] = option.split('=');
    cookieOptions[key.toLowerCase()] = val || true;
  });

  return { name, value, options: cookieOptions };
}
