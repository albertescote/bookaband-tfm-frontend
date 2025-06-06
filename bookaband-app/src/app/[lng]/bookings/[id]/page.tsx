import { getBookingById } from '@/service/backend/booking/service/booking.service';
import { fetchEventTypes } from '@/service/backend/eventTypes/service/eventType.service';
import BookingDetail from '@/components/bookings/BookingDetail';
import { notFound } from 'next/navigation';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';

interface PageParams {
  params: {
    lng: string;
    id: string;
  };
}

export default async function Page({ params: { lng, id } }: PageParams) {
  const [booking, eventTypes] = await Promise.all([
    getBookingById(id),
    fetchEventTypes(),
  ]);

  if (!booking) {
    notFound();
  }

  const validEventTypes: EventType[] = Array.isArray(eventTypes)
    ? eventTypes
    : [];

  return (
    <BookingDetail
      language={lng}
      initialBooking={booking}
      initialEventTypes={validEventTypes}
    />
  );
}
