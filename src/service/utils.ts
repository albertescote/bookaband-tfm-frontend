import { cookies } from 'next/headers';

export function getAccessTokenCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('access_token_music_manager')?.value;
}

export function deleteAccessTokenCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('access_token_music_manager');
}
