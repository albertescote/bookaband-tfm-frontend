import OffersList from '@/components/home/offersList';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  return (
    <main>
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
        <OffersList lng={lng} />
      </div>
    </main>
  );
}
