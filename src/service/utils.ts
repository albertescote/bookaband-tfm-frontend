import { cookies } from 'next/headers';

export function getAccessTokenCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('access_token_learning_platform')?.value;
}
