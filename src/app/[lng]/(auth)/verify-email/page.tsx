'use client';

import EmailVerification from '@/components/email/EmailVerification';

export default function VerifyEmailPage({ params: { lng } }: { params: { lng: string } }) {
  return <EmailVerification lng={lng} />;
}
