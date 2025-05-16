export function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'open.spotify.com') return null;

    const parts = parsed.pathname.split('/');
    if (parts.length < 3) return null;

    const [, type, id] = parts;
    if (
      !['artist', 'track', 'album', 'playlist', 'episode', 'show'].includes(
        type,
      )
    )
      return null;

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}
