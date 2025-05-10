'use client';

import { useTranslation } from '@/app/i18n/client';
import { CheckCircle } from 'lucide-react';

interface StatusFailed {
  lng: string;
  message: string;
}

export default function StatusSuccess({ lng, message }: StatusFailed) {
  const { t } = useTranslation(lng, 'verify-email');

  return (
    <div className="text-center text-green-600">
      <CheckCircle className="mx-auto mb-4 h-10 w-10" />
      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        {t('success.title')}
      </h2>
      {message && <p className="text-gray-600">{message}</p>}
      <p className="mt-4 text-sm text-gray-500">{t('success.redirecting')}</p>
    </div>
  );
}
