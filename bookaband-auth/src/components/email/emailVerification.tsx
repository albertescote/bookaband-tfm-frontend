'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmailToken } from '@/service/backend/email/service/email.service';
import { VerificationStatus } from '@/service/backend/email/domain/verificationStatus';
import { useTranslation } from '@/app/i18n/client';
import { motion } from 'framer-motion';
import StatusFailed from '@/components/email/statusFailed';
import StatusSuccess from '@/components/email/statusSuccess';

interface EmailVerificationProps {
  lng: string;
  token: string;
}

export default function EmailVerification({
  lng,
  token,
}: EmailVerificationProps) {
  const { t } = useTranslation(lng, 'verify-email');
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmailToken({ token });
        if (!response) {
          setStatus(VerificationStatus.FAILED);
          setMessage(t('error'));
          return;
        }
        setStatus(response?.status);
        setMessage(response?.message || '');

        if (response?.status === VerificationStatus.VERIFIED) {
          setTimeout(() => {
            router.push(`/${lng}/complete-profile`);
          }, 3000);
        }
      } catch (error) {
        setStatus(VerificationStatus.FAILED);
        setMessage(t('error'));
      }
    };

    verify().then();
  }, [token, router, t, lng]);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/login-background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
      >
        {status === VerificationStatus.VERIFIED && (
          <StatusSuccess lng={lng} message={message}></StatusSuccess>
        )}

        {status === VerificationStatus.FAILED && (
          <StatusFailed lng={lng} message={message}></StatusFailed>
        )}
      </motion.div>
    </div>
  );
}
