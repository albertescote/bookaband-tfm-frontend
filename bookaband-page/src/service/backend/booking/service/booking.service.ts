'use server';
import { Booking } from '@/service/backend/booking/domain/booking';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import { BookingContract } from '@/service/backend/booking/domain/bookingContract';
import { BookingInvoice } from '@/service/backend/booking/domain/bookingInvoice';

export interface CreateBookingRequest {
  bandId: string;
  initDate: string;
  endDate: string;
  name: string;
  country: string;
  city: string;
  venue: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  eventTypeId?: string;
  isPublic?: boolean;
}

export async function createBooking(
  request: CreateBookingRequest,
): Promise<Booking | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.post('/bookings', request).then((res) => res.data),
  );
}

export async function getBookingById(
  bookingId: string,
): Promise<BookingSummary | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/${bookingId}`)
      .then((res) => res.data),
  );
}

export async function getAllUserBookings(): Promise<
  BookingSummary[] | undefined
> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/bookings/client').then((res) => res.data),
  );
}

export async function cancelBooking(
  bookingId: string,
): Promise<BookingSummary> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/bookings/${bookingId}/cancel`)
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

export async function getBookingInvoice(
  bookingId: string,
): Promise<BookingInvoice | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/bookings/${bookingId}/invoice`)
      .then((res) => res.data),
  );
}
