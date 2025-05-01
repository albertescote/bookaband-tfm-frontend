'use server';
import { EmailVerificationResponse } from '@/service/backend/email/domain/emailVerificationResponse';
import axiosInstance from '@/service/aixosInstance';

export async function verifyEmailToken(request: {
  token?: string;
}): Promise<EmailVerificationResponse | undefined> {
  try {
    return await axiosInstance
      .post('/email/verify', request)
      .then((res) => res.data);
  } catch (e) {
    return undefined;
  }
}

export async function resendEmail(request: { userId?: string }): Promise<void> {
  try {
    return await axiosInstance
      .post('/email/resend', request)
      .then((res) => res.data);
  } catch (e) {
    return undefined;
  }
}
