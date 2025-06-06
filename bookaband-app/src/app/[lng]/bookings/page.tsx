import BookingsList from '@/components/bookings/BookingsList';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  return <BookingsList language={lng} />;
}
