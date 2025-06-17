import BookingsList from '@/components/bookings/BookingsList';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
}

export default async function Page({ params }: PageParams) {
  const { lng } = await params;
  return <BookingsList language={lng} />;
}
