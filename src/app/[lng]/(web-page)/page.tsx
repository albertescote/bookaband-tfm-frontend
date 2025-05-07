import Hero from '@/components/web-page/home/hero';
import FeaturedArtists from '@/components/web-page/home/featuredArtists';
import Testimonials from '@/components/web-page/home/testimonials';
import CallToAction from '@/components/web-page/home/callToAction';

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
