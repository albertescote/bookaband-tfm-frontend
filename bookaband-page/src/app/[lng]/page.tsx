import Hero from '@/components/home/hero';
import FeaturedArtists from '@/components/home/featuredArtists';
import Testimonials from '@/components/home/testimonials';
import CallToAction from '@/components/home/callToAction';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  const musicalStyles = await fetchMusicalStyles();

  return (
    <main>
      <div>
        <Hero lng={lng} />
        <FeaturedArtists lng={lng} musicalStyles={musicalStyles ?? []} />
        <Testimonials lng={lng} />
        <CallToAction lng={lng} />
      </div>
    </main>
  );
}
