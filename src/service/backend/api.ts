import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { Offer } from '@/service/backend/domain/offer';

export async function getAllOffers(): Promise<Offer[]> {
  try {
    const response = await axios.get(BACKEND_URL + '/offers');
    if (!response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return [];
  }
}
