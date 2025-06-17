import { cookies } from 'next/headers';
import { ParsedCookie } from '@/service/backend/auth/domain/parsedCookie';

export async function setTokenCookie(
  parsedCookie: ParsedCookie,
  maxAge?: number,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(parsedCookie.name, parsedCookie.value, {
    httpOnly: parsedCookie.options.httponly as boolean,
    sameSite: parsedCookie.options.samesite as 'strict' | 'lax' | 'none',
    secure: parsedCookie.options.secure as boolean,
    maxAge,
  });
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
}

export async function deleteAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
}

export async function deleteRefreshTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
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
