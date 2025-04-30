'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/service/backend/email/service/email.service';
import { VerificationStatus } from '@/service/backend/email/domain/verificationStatus';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface EmailVerificationProps {
  lng: string;
}

export default function EmailVerification({ lng }: EmailVerificationProps) {
  const { t } = useTranslation(lng, 'verify-email');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus(VerificationStatus.FAILED);
      setMessage(t('noToken'));
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail({ token });
        if (!response) {
          setStatus(VerificationStatus.FAILED);
          setMessage(t('error'));
          return;
        }
        setStatus(response?.status);
        setMessage(response?.message || '');

        if (response?.status === VerificationStatus.VERIFIED) {
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (error) {
        setStatus(VerificationStatus.FAILED);
        setMessage(t('error'));
      }
    };

    verify().then();
  }, [searchParams, router, t]);

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
          <div className="text-center text-green-600">
            <CheckCircle className="mx-auto mb-4 h-10 w-10" />
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {t('success.title')}
            </h2>
            {message && <p className="text-gray-600">{message}</p>}
            <p className="mt-4 text-sm text-gray-500">
              {t('success.redirecting')}
            </p>
          </div>
        )}

        {status === VerificationStatus.FAILED && (
          <div className="text-center text-red-600">
            <XCircle className="mx-auto mb-4 h-10 w-10" />
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {t('failed.title')}
            </h2>
            {message && <p className="text-gray-600">{message}</p>}
            <p className="mt-4 text-sm text-gray-500">{t('failed.help')}</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/sign-up"
                className="block w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 text-center font-bold text-white transition-transform hover:scale-105"
              >
                {t('failed.tryAgain')}
              </Link>
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-gray-600 px-4 py-2 text-center font-bold text-white transition-transform hover:scale-105"
              >
                {t('failed.contactSupport')}
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
