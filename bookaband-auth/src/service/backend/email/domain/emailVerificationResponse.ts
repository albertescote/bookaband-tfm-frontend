import { VerificationStatus } from '@/service/backend/email/domain/verificationStatus';

export interface EmailVerificationResponse {
  status: VerificationStatus;
  message?: string;
}
