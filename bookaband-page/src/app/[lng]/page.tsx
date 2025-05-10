import Hero from '@/components/home/hero';
import FeaturedArtists from '@/components/home/featuredArtists';
import Testimonials from '@/components/home/testimonials';
import CallToAction from '@/components/home/callToAction';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  return (
    <main>
      <div>
        <Hero lng={lng} />
        <FeaturedArtists lng={lng} />
        <Testimonials lng={lng} />
        <CallToAction lng={lng} />
      </div>
    </main>
  );
}
