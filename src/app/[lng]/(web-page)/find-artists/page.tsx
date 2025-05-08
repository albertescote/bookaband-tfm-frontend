import FindArtistsContent from '@/components/web-page/find-artists/find-artists-content';

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-white">
      <FindArtistsContent language={lng} />
    </div>
  );
}
