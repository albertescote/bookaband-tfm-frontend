'use server';
import { Booking } from '@/service/backend/booking/domain/booking';
import { getAccessTokenCookie } from '@/service/utils';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { BookingWithDetails } from '@/service/backend/booking/domain/bookingWithDetails';

export async function createBooking(request: {
  offerId?: string;
  date: Date;
}): Promise<Booking | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create booking failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.post(
      BACKEND_URL + '/bookings',
      { offerId: request.offerId, date: request.date.toISOString() },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getBookingById(
  bookingId: string,
): Promise<BookingWithDetails | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get booking failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getAllUserBookings(): Promise<
  BookingWithDetails[] | undefined
> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get all bookings failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bookings/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getAllBandBookings(
  bandId: string,
): Promise<BookingWithDetails[] | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get all bookings failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bookings/band/${bandId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function acceptBooking(id?: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Accept booking failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.put(
      BACKEND_URL + `/bookings/${id}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function declineBooking(id?: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Decline booking failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.put(
      BACKEND_URL + `/bookings/${id}/decline`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}
