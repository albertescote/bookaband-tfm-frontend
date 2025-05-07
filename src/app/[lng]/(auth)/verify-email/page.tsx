'use client';

import EmailVerification from '@/components/auth/email/EmailVerification';

export default function VerifyEmailPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return <EmailVerification lng={lng} />;
}
