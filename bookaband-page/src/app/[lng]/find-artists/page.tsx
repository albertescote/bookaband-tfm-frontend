import FindArtistsContent from '@/components/find-artists/find-artists-content';

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <div className="min-h-screen">
      <FindArtistsContent language={lng} />
    </div>
  );
}
