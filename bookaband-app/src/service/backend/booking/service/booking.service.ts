'use server';
import { Booking } from '@/service/backend/booking/domain/booking';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import { BookingContract } from '@/service/backend/booking/service/bookingContract';

export async function getBookingById(
  bookingId: string,
): Promise<BookingSummary | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/${bookingId}`)
      .then((res) => res.data),
  );
}

export async function getBookingContract(
  bookingId: string,
): Promise<BookingContract | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/${bookingId}/contract`)
      .then((res) => res.data),
  );
}

export async function getAllBandBookings(
  bandId: string,
): Promise<BookingSummary[] | undefined> {
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
