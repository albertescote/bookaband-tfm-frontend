'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { XCircle } from 'lucide-react';

interface StatusFailed {
  lng: string;
  message: string;
}

export default function StatusFailed({ lng, message }: StatusFailed) {
  const { t } = useTranslation(lng, 'verify-email');

  return (
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
  );
}
