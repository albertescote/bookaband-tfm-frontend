'use client';

import { useTranslation } from '@/app/i18n/client';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { resendEmail } from '@/service/backend/email/service/email.service';

interface EmailVerificationWaitProps {
  language: string;
  email: string;
  userId: string;
}

export default function EmailVerificationWait({
  language,
  email,
  userId,
}: EmailVerificationWaitProps) {
  const { t } = useTranslation(language, 'signUp');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = () => {
    resendEmail({ userId }).then((res) => {
      toast.success(t('verification-email-resent'));
      setCanResend(false);
      setCountdown(30);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-[#15b7b9]/10 p-4">
          <Mail className="h-8 w-8 text-[#15b7b9]" />
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-800">
          {t('verify-email-title')}
        </h1>

        <p className="text-center text-gray-600">
          {t('verify-email-message') + ' ' + email}
        </p>

        <div className="w-full space-y-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full w-full bg-[#15b7b9]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            {t('verify-email-hint')}
          </p>

          {!canResend ? (
            <p className="text-center text-sm text-gray-500">
              {t('resend-available-in') + ' '}
              <span className="font-semibold text-[#15b7b9]">{countdown}</span>
              {' ' + t('seconds')}
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105"
            >
              {t('resend-verification')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
