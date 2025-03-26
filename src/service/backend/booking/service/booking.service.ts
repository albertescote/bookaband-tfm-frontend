'use server';
import { Booking } from '@/service/backend/booking/domain/booking';
import { BookingWithDetails } from '@/service/backend/booking/domain/bookingWithDetails';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function createBooking(request: {
  offerId?: string;
  date: Date;
}): Promise<Booking | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post('/bookings', {
        offerId: request.offerId,
        date: request.date.toISOString(),
      })
      .then((res) => res.data),
  );
}

export async function getBookingById(
  bookingId: string,
): Promise<BookingWithDetails | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/${bookingId}`)
      .then((res) => res.data),
  );
}

export async function getAllUserBookings(): Promise<
  BookingWithDetails[] | undefined
> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/bookings/user').then((res) => res.data),
  );
}

export async function getAllBandBookings(
  bandId: string,
): Promise<BookingWithDetails[] | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/band/${bandId}`)
      .then((res) => res.data),
  );
}

export async function acceptBooking(id?: string): Promise<Booking> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/bookings/${id}/accept`)
      .then((res) => res.data),
  );
}

export async function declineBooking(id?: string): Promise<Booking> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/bookings/${id}/decline`)
      .then((res) => res.data),
  );
}
