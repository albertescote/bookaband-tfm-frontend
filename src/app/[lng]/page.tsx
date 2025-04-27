import Hero from '@/components/home/hero';
import Testimonials from '@/components/home/testimonials';
import CallToAction from '@/components/home/callToAction';
import FeaturedArtists from '@/components/home/featuredArtists';

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
